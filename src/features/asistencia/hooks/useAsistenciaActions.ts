import { toast } from "sonner";
import type {
  AsignarJornadaAsistenciaDto,
  ResolverDiaAsistenciaDto,
  ResolverIncidenciaDto,
} from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { ROOT_KEYS } from "@/lib/queryKeys.config";
import {
  asistenciaService,
  type MarcacionManualDto,
} from "../services/asistencia.service";
import { asistenciaKey } from "./useAsistencia";
import { marcacionesKey } from "./useMarcaciones";

/**
 * Vuelve a calcular el resumen del mes después de cambiar sus fuentes
 *
 * @remarks
 * Una marcación, una decisión o una jornada nueva cambian el resultado del
 * mes, pero el resumen guardado no se actualiza solo. Si el cambio ya se
 * guardó y el recálculo falla, se avisa sin deshacer lo hecho.
 */
const regenerarResumen = async (empleadoId: string, periodo: string) => {
  try {
    await asistenciaService.generar(empleadoId, periodo);
  } catch {
    toast.warning(
      "Se guardó el cambio, pero no se pudo actualizar el resumen. Actualízalo manualmente.",
    );
  }
};

/** Calcula o actualiza el resumen del mes, avisa y refresca la pestaña */
export function useGenerarResumen(empleadoId: string, periodo: string) {
  return useMutationConAviso({
    mutationFn: () => asistenciaService.generar(empleadoId, periodo),
    successMessage: "El resumen del mes se actualizó.",
    invalidate: [asistenciaKey.all],
  });
}

/** Aprueba el resumen del mes, avisa y refresca la pestaña */
export function useAprobarResumen(empleadoId: string, periodo: string) {
  return useMutationConAviso({
    mutationFn: () => asistenciaService.aprobar(empleadoId, periodo),
    successMessage: "El resumen del mes se aprobó.",
    invalidate: [asistenciaKey.all],
  });
}

/** Rechaza o reabre el resumen del mes, avisa y refresca la pestaña */
export function useResolverResumen() {
  return useMutationConAviso({
    mutationFn: (dto: ResolverIncidenciaDto) =>
      asistenciaService.resolverResumen(dto),
    successMessage: (_, { accion }) =>
      accion === "RECHAZAR"
        ? "El resumen del mes se rechazó."
        : "El resumen del mes se reabrió.",
    invalidate: [asistenciaKey.all],
  });
}

/** Registra una marcación manual, actualiza el resumen del mes y refresca la pestaña */
export function useMarcacionManual(empleadoId: string, periodo: string) {
  return useMutationConAviso({
    mutationFn: (dto: MarcacionManualDto) => asistenciaService.marcar(dto),
    successMessage: "La marcación se registró correctamente.",
    afterSuccess: () => regenerarResumen(empleadoId, periodo),
    invalidate: [asistenciaKey.all],
  });
}

/** Datos para registrar una marcación manual desde el listado global */
interface MarcacionGlobalVars {
  dto: MarcacionManualDto;
  empleadoId: string;
  /** Mes de la marcación (YYYY-MM), cuyo resumen se actualiza */
  periodo: string;
}

/**
 * Registra una marcación manual de cualquier colaborador (listado global)
 *
 * @remarks
 * El empleado y el mes llegan al enviar, porque se eligen en el formulario.
 * Actualiza el resumen del mes y refresca el listado y la asistencia.
 */
export function useMarcacionManualGlobal() {
  return useMutationConAviso({
    mutationFn: ({ dto }: MarcacionGlobalVars) => asistenciaService.marcar(dto),
    successMessage: "La marcación se registró correctamente.",
    afterSuccess: (_, { empleadoId, periodo }) =>
      regenerarResumen(empleadoId, periodo),
    invalidate: [marcacionesKey.all, asistenciaKey.all],
  });
}

/** Resuelve un día, actualiza el resumen del mes y refresca la pestaña */
export function useResolverDia(empleadoId: string, periodo: string) {
  return useMutationConAviso({
    mutationFn: (dto: ResolverDiaAsistenciaDto) =>
      asistenciaService.resolverDia(dto),
    successMessage: "El día se resolvió correctamente.",
    afterSuccess: () => regenerarResumen(empleadoId, periodo),
    invalidate: [asistenciaKey.all],
  });
}

/**
 * Asigna una jornada, actualiza el resumen del mes y refresca la pestaña
 *
 * @remarks
 * La jornada del empleado se muestra en la ficha: también se refresca la
 * consulta de empleados.
 */
export function useAsignarJornada(empleadoId: string, periodo: string) {
  return useMutationConAviso({
    mutationFn: (dto: AsignarJornadaAsistenciaDto) =>
      asistenciaService.asignarJornada(dto),
    successMessage: "La jornada se asignó correctamente.",
    afterSuccess: () => regenerarResumen(empleadoId, periodo),
    invalidate: [asistenciaKey.all, ROOT_KEYS.empleados],
  });
}
