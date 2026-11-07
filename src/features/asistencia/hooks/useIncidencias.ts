import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { incidenciasService } from "../services/incidencias.service";
import type { IncidenciaFilters } from "../types/incidencias.types";
import { asistenciaKey } from "./useAsistencia";

/**
 * Claves de caché del cierre mensual
 *
 * @remarks
 * Cuelgan de `asistenciaKey.all`: cualquier cambio de asistencia (aprobar o
 * generar desde la ficha, una marcación) refresca también el cierre.
 */
export const incidenciasKey = {
  all: [...asistenciaKey.all, "incidencias"] as const,
  list: (filters: IncidenciaFilters) =>
    [...asistenciaKey.all, "incidencias", "list", filters] as const,
  conteo: (periodo: string, areaId?: string) =>
    [
      ...asistenciaKey.all,
      "incidencias",
      "conteo",
      periodo,
      areaId ?? null,
    ] as const,
};

/**
 * Obtiene una página de resúmenes mensuales según los filtros
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva.
 */
export function useIncidencias(filters: IncidenciaFilters) {
  return useQuery({
    queryKey: incidenciasKey.list(filters),
    queryFn: () => incidenciasService.list(filters),
    placeholderData: keepPreviousData,
  });
}

/** Cuántos resúmenes hay en cada estado en el mes (y el área, si se filtra) */
export function useConteoIncidencias(periodo: string, areaId?: string) {
  return useQuery({
    queryKey: incidenciasKey.conteo(periodo, areaId),
    queryFn: () => incidenciasService.contar(periodo, areaId),
    placeholderData: keepPreviousData,
  });
}
