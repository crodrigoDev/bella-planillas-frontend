import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { solicitudesService } from "../services/solicitudes.service";
import type { SolicitudFilters } from "../types/solicitudes.types";

/**
 * Claves de caché de solicitudes
 *
 * @remarks
 * Invalidar `all` refresca el listado (y sus conteos), el detalle y el historial.
 */
export const solicitudesKey = {
  all: ["solicitudes"] as const,
  list: (filters: SolicitudFilters) =>
    ["solicitudes", "list", filters] as const,
  detail: (id: string) => ["solicitudes", "detail", id] as const,
  historial: (id: string) => ["solicitudes", "historial", id] as const,
};

/**
 * Obtiene una página de solicitudes según los filtros
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva.
 */
export function useSolicitudes(filters: SolicitudFilters) {
  return useQuery({
    queryKey: solicitudesKey.list(filters),
    queryFn: () => solicitudesService.list(filters),
    placeholderData: keepPreviousData,
  });
}

/**
 * Obtiene una solicitud con su detalle
 *
 * @param id - Id o código de la solicitud; sin él no se consulta
 * @returns La consulta; `data` es null si la solicitud no existe
 */
export function useSolicitud(id: string | undefined) {
  return useQuery({
    queryKey: solicitudesKey.detail(id ?? ""),
    queryFn: () => solicitudesService.getById(id as string),
    enabled: Boolean(id),
  });
}

/**
 * Obtiene el historial de una solicitud
 *
 * @param id - Id o código de la solicitud; sin él no se consulta
 */
export function useSolicitudHistorial(id: string | undefined) {
  return useQuery({
    queryKey: solicitudesKey.historial(id ?? ""),
    queryFn: () => solicitudesService.getHistorial(id as string),
    enabled: Boolean(id),
  });
}
