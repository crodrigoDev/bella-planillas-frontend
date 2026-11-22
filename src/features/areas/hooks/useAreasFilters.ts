import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import type { AreaFilters } from "../types/areas.types";

/**
 * Lee los filtros del listado de áreas de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL y las funciones para modificarlos
 *
 * @remarks
 * Cambiar la búsqueda vuelve a la primera página. Los valores inválidos de
 * página o límite se ignoran.
 */
export function useAreasFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const filters: AreaFilters = {
    page,
    limit,
    search: searchParams.get("search")?.trim() || undefined,
  };

  const hasActiveFilters = filters.search !== undefined;

  const setSearch = (value: string) => {
    updateParams({ search: value.trim() || undefined, page: undefined });
  };

  const clearFilters = () => {
    updateParams({ search: undefined, page: undefined });
  };

  return {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    clearFilters,
  };
}
