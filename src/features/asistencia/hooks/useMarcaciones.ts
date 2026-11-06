import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { marcacionesService } from "../services/marcaciones.service";
import type { MarcacionFilters } from "../types/marcaciones.types";

/**
 * Claves de caché de las marcaciones globales
 *
 * @remarks
 * Invalidar `all` refresca el listado sin importar los filtros que tenga.
 */
export const marcacionesKey = {
  all: ["marcaciones"] as const,
  list: (filters: MarcacionFilters) =>
    ["marcaciones", "list", filters] as const,
};

/**
 * Obtiene una página de marcaciones según los filtros
 *
 * @param filters - Página y filtros del listado
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva.
 */
export function useMarcaciones(filters: MarcacionFilters) {
  return useQuery({
    queryKey: marcacionesKey.list(filters),
    queryFn: () => marcacionesService.list(filters),
    placeholderData: keepPreviousData,
  });
}
