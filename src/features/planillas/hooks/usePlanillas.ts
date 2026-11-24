import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { planillasService } from "../services/planillas.service";
import type { PlanillasFilters } from "../types/planillas.types";

/**
 * Claves de caché de la feature planillas
 */
export const planillasKey = {
  all: ROOT_KEYS.planillas,
  lists: () => ["planillas", "list"] as const,
  list: (filters: PlanillasFilters) =>
    ["planillas", "list", filters] as const,
  detail: (id: string) => ["planillas", "detail", id] as const,
  trabajo: (trabajoId: string) =>
    ["planillas", "trabajo", trabajoId] as const,
};

/**
 * Obtiene una página del listado mensual de planillas
 *
 * @remarks
 * Conserva visible la página anterior mientras llega la siguiente.
 */
export function usePlanillas(filters: PlanillasFilters) {
  return useQuery({
    queryKey: planillasKey.list(filters),
    queryFn: () => planillasService.list(filters),
    placeholderData: keepPreviousData,
  });
}
