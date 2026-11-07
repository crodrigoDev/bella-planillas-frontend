import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { jornadasService } from "../services/jornadas.service";
import type { JornadaFilters } from "../types/jornadas.types";

/**
 * Claves de caché de jornadas
 *
 * @remarks
 * Invalidar `all` refresca el listado y los detalles. El catálogo de jornadas
 * que usan empleados y asistencia vive aparte (`["catalogos", "jornadas"]`).
 */
export const jornadasKey = {
  all: ["jornadas"] as const,
  list: (filters: JornadaFilters) => ["jornadas", "list", filters] as const,
  detail: (id: string) => ["jornadas", "detail", id] as const,
};

/**
 * Obtiene una página de jornadas según los filtros
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva.
 */
export function useJornadas(filters: JornadaFilters) {
  return useQuery({
    queryKey: jornadasKey.list(filters),
    queryFn: () => jornadasService.list(filters),
    placeholderData: keepPreviousData,
  });
}

/**
 * Obtiene una jornada con su horario, para editarla
 *
 * @param id - Id de la jornada; sin id no se consulta
 * @returns La consulta; `data` es null si la jornada no existe
 */
export function useJornada(id: string | undefined) {
  return useQuery({
    queryKey: jornadasKey.detail(id ?? ""),
    queryFn: () => jornadasService.getById(id as string),
    enabled: Boolean(id),
  });
}
