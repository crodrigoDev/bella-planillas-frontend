import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { areasService } from "../services/areas.service";
import type { AreaFilters } from "../types/areas.types";

/**
 * Claves de caché de áreas
 *
 * @remarks
 * El catálogo de áreas que usan empleados, jornadas y contratos vive aparte
 * en `["catalogos", "areas"]`.
 */
export const areasKey = {
  all: ROOT_KEYS.areas,
  list: (filters: AreaFilters) => ["areas", "list", filters] as const,
};

/**
 * Obtiene una página de áreas según los filtros
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva.
 */
export function useAreas(filters: AreaFilters) {
  return useQuery({
    queryKey: areasKey.list(filters),
    queryFn: () => areasService.list(filters),
    placeholderData: keepPreviousData,
  });
}
