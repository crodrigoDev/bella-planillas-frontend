import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { parseUuid } from "@/lib/urlParams.utils";
import type { EstadoResumen } from "../types/asistencia.types";
import type {
  IncidenciaFilterKey,
  IncidenciaFilters,
} from "../types/incidencias.types";
import { getPeriodoActual, parsePeriodo } from "../utils/asistencia.utils";

const parseEstado = (value: string | null): EstadoResumen | undefined =>
  value === "PENDIENTE" || value === "APROBADO" || value === "RECHAZADO"
    ? value
    : undefined;

/**
 * Lee los filtros del cierre mensual de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL y las funciones para modificarlos
 *
 * @remarks
 * El mes es obligatorio: sin uno válido en la URL se usa el actual (y no se
 * escribe en la URL). Cualquier cambio de filtro vuelve a la primera página.
 * "Limpiar filtros" no toca el mes.
 */
export function useCierreMensualFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const filters: IncidenciaFilters = {
    page,
    limit,
    periodo: parsePeriodo(searchParams.get("periodo")) ?? getPeriodoActual(),
    area_id: parseUuid(searchParams.get("area_id")),
    estado: parseEstado(searchParams.get("estado")),
    busqueda: searchParams.get("busqueda") || undefined,
  };

  const hasActiveFilters =
    filters.area_id !== undefined ||
    filters.estado !== undefined ||
    filters.busqueda !== undefined;

  const setFilter = (key: IncidenciaFilterKey, value: string | undefined) => {
    updateParams({ [key]: value || undefined, page: undefined });
  };

  const setPeriodo = (periodo: string) => {
    updateParams({
      periodo: periodo === getPeriodoActual() ? undefined : periodo,
      page: undefined,
    });
  };

  const clearFilters = () => {
    updateParams({
      area_id: undefined,
      estado: undefined,
      busqueda: undefined,
      page: undefined,
    });
  };

  return {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    setPeriodo,
    clearFilters,
  };
}
