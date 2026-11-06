import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { parseUuid, parseBoolean } from "@/lib/urlParams.utils";
import type {
  EmpleadoFilterKey,
  EmpleadoFilters,
} from "@/features/empleados/types/empleados.types";

/**
 * Lee los filtros del listado de la URL y permite cambiarlos
 *
 * @returns Los filtros listos para consultar y las funciones para modificarlos
 *
 * @remarks
 * La URL es la fuente de la verdad, asi los filtros sobreviven al F5 y
 * se pueden compartir como enlace.
 * Cualquier cambio de busqueda o filtro vuelve a la primera página
 */
export function useEmpleadosFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const filters: EmpleadoFilters = {
    page,
    limit,
    search: searchParams.get("search") || undefined,
    area_id: parseUuid(searchParams.get("area_id")),
    cargo_id: parseUuid(searchParams.get("cargo_id")),
    jornada_id: parseUuid(searchParams.get("jornada_id")),
    activo: parseBoolean(searchParams.get("activo")),
  };

  const hasActiveFilters =
    filters.search !== undefined ||
    filters.area_id !== undefined ||
    filters.cargo_id !== undefined ||
    filters.jornada_id !== undefined ||
    filters.activo !== undefined;

  const setSearch = (search: string) => {
    updateParams({ search: search.trim() || undefined, page: undefined });
  };

  const setFilter = (key: EmpleadoFilterKey, value: string | undefined) => {
    updateParams({
      [key]: value,
      page: undefined,
      // Un cargo pertenece a un area, al cambiar de area, el cargo deja de valer
      ...(key === "area_id" && { cargo_id: undefined }),
    });
  };

  const clearFilters = () => {
    updateParams({
      search: undefined,
      area_id: undefined,
      cargo_id: undefined,
      jornada_id: undefined,
      activo: undefined,
      page: undefined,
    });
  };

  return {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    setFilter,
    clearFilters,
  };
}
