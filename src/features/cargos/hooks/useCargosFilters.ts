import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { parseUuid } from "@/lib/urlParams.utils";
import type { CargoFilters } from "../types/cargos.types";

/**
 * Lee los filtros del listado de cargos de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL y las funciones para modificarlos
 *
 * @remarks
 * La URL guarda `area_id` y el filtro se envía como `id_area`. Cambiar la
 * búsqueda o el área vuelve a la primera página. Los valores inválidos de
 * página, límite o área se ignoran.
 */
export function useCargosFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const filters: CargoFilters = {
    page,
    limit,
    search: searchParams.get("search")?.trim() || undefined,
    id_area: parseUuid(searchParams.get("area_id")),
  };

  const hasActiveFilters =
    filters.search !== undefined || filters.id_area !== undefined;

  const setSearch = (value: string) => {
    updateParams({ search: value.trim() || undefined, page: undefined });
  };

  const setAreaId = (value: string | undefined) => {
    updateParams({ area_id: value || undefined, page: undefined });
  };

  const clearFilters = () => {
    updateParams({ search: undefined, area_id: undefined, page: undefined });
  };

  return {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    setAreaId,
    clearFilters,
  };
}
