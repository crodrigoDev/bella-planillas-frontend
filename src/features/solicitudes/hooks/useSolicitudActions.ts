import type { EvaluarSolicitudDto } from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { solicitudesService } from "../services/solicitudes.service";
import type { NuevaSolicitudDto } from "../types/solicitudes.types";
import { solicitudesKey } from "./useSolicitudes";

const INVALIDATE = [solicitudesKey.all];

/** Datos para registrar una solicitud: el DTO y el sustento, si lo hay */
interface CrearSolicitudVars {
  dto: NuevaSolicitudDto;
  archivo: File | null;
}

/** Registra una solicitud, avisa y refresca el listado */
export function useCrearSolicitud() {
  return useMutationConAviso({
    mutationFn: ({ dto, archivo }: CrearSolicitudVars) =>
      solicitudesService.crear(dto, archivo),
    successMessage: (creada) => `La solicitud ${creada.codigo} fue registrada.`,
    invalidate: INVALIDATE,
  });
}

/**
 * Toma una solicitud para revisarla, avisa y refresca listado, detalle e historial
 *
 * @param id - Id de la solicitud
 * @param codigo - Código para el aviso
 */
export function useTomarSolicitud(id: string, codigo: string) {
  return useMutationConAviso({
    mutationFn: () => solicitudesService.tomar(id),
    successMessage: `Tomaste la solicitud ${codigo}: ya puedes evaluarla.`,
    invalidate: INVALIDATE,
  });
}

/**
 * Aprueba o rechaza una solicitud, avisa y refresca listado, detalle e historial
 *
 * @remarks
 * Aprobar no recalcula el resumen de asistencia del colaborador: hay que
 * actualizar el resumen del mes desde su ficha.
 */
export function useEvaluarSolicitud(id: string, codigo: string) {
  return useMutationConAviso({
    mutationFn: (dto: EvaluarSolicitudDto) =>
      solicitudesService.evaluar(id, dto),
    successMessage: (_, dto) =>
      dto.estado === "APROBADA"
        ? `La solicitud ${codigo} fue aprobada.`
        : `La solicitud ${codigo} fue rechazada.`,
    invalidate: INVALIDATE,
  });
}

/** Anula una solicitud, avisa y refresca listado, detalle e historial */
export function useAnularSolicitud(id: string, codigo: string) {
  return useMutationConAviso({
    mutationFn: (motivo: string) => solicitudesService.anular(id, motivo),
    successMessage: `La solicitud ${codigo} fue anulada.`,
    invalidate: INVALIDATE,
  });
}
