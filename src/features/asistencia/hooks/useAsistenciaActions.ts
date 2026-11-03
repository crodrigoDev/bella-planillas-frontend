import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  AsignarJornadaAsistenciaDto,
  ResolverDiaAsistenciaDto,
  ResolverIncidenciaDto,
} from "@jyp/shared-contracts";

import {
  asistenciaService,
  type MarcacionManualDto,
} from "../services/asistencia.service";
import { asistenciaKey } from "./useAsistencia";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => asistenciaService.generar(empleadoId, periodo),
    onSuccess: () => {
      toast.success("El resumen del mes se actualizó.");

      return queryClient.invalidateQueries({ queryKey: asistenciaKey.all });
    },
  });
}

/** Aprueba el resumen del mes, avisa y refresca la pestaña */
export function useAprobarResumen(empleadoId: string, periodo: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => asistenciaService.aprobar(empleadoId, periodo),
    onSuccess: () => {
      toast.success("El resumen del mes se aprobó.");

      return queryClient.invalidateQueries({ queryKey: asistenciaKey.all });
    },
  });
}

/** Rechaza o reabre el resumen del mes, avisa y refresca la pestaña */
export function useResolverResumen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ResolverIncidenciaDto) =>
      asistenciaService.resolverResumen(dto),
    onSuccess: (_, { accion }) => {
      toast.success(
        accion === "RECHAZAR"
          ? "El resumen del mes se rechazó."
          : "El resumen del mes se reabrió.",
      );

      return queryClient.invalidateQueries({ queryKey: asistenciaKey.all });
    },
  });
}

/** Registra una marcación manual, actualiza el resumen del mes y refresca la pestaña */
export function useMarcacionManual(empleadoId: string, periodo: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: MarcacionManualDto) => asistenciaService.marcar(dto),
    onSuccess: async () => {
      toast.success("La marcación se registró correctamente.");
      await regenerarResumen(empleadoId, periodo);

      return queryClient.invalidateQueries({ queryKey: asistenciaKey.all });
    },
  });
}

/** Resuelve un día, actualiza el resumen del mes y refresca la pestaña */
export function useResolverDia(empleadoId: string, periodo: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ResolverDiaAsistenciaDto) =>
      asistenciaService.resolverDia(dto),
    onSuccess: async () => {
      toast.success("El día se resolvió correctamente.");
      await regenerarResumen(empleadoId, periodo);

      return queryClient.invalidateQueries({ queryKey: asistenciaKey.all });
    },
  });
}

/**
 * Asigna una jornada, actualiza el resumen del mes y refresca la pestaña
 *
 * @remarks
 * La jornada del empleado se muestra en la ficha: también se refresca la
 * consulta `["empleados"]` de la feature `empleados`; se repite aquí su clave
 * porque una feature no importa de otra.
 */
export function useAsignarJornada(empleadoId: string, periodo: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AsignarJornadaAsistenciaDto) =>
      asistenciaService.asignarJornada(dto),
    onSuccess: async () => {
      toast.success("La jornada se asignó correctamente.");
      await regenerarResumen(empleadoId, periodo);

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: asistenciaKey.all }),
        queryClient.invalidateQueries({ queryKey: ["empleados"] }),
      ]);
    },
  });
}
