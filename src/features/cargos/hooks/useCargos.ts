import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { cargosService } from "../services/cargos.service";
import type { CargoFilters } from "../types/cargos.types";

/**
 * Claves de caché de cargos
 *
 * @remarks
 * El catálogo de cargos que usan empleados vive aparte en
 * `["catalogos", "cargos", ...]`.
 */
export const cargosKey = {
  all: ROOT_KEYS.cargos,
  list: (filters: CargoFilters) => ["cargos", "list", filters] as const,
};

/**
 * Obtiene una página de cargos según los filtros
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva.
 */
export function useCargos(filters: CargoFilters) {
  return useQuery({
    queryKey: cargosKey.list(filters),
    queryFn: () => cargosService.list(filters),
    placeholderData: keepPreviousData,
  });
}
