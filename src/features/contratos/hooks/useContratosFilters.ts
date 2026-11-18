import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { parseUuid } from "@/lib/urlParams.utils";
import { ESTADOS_FILTRO, POR_VENCER_DIAS } from "../config/contratos.config";
import type {
  ContratoFilterKey,
  ContratoFilters,
  EstadoContratoFiltro,
  PorVencerDias,
} from "../types/contratos.types";

/** Ignora los estados que el backend no devuelve (como ANULADO) o que no existen */
const parseEstado = (value: string | null): EstadoContratoFiltro | undefined =>
  ESTADOS_FILTRO.find((estado) => estado === value);

/** Solo acepta los plazos que ofrece el filtro */
const parsePorVencer = (value: string | null): PorVencerDias | undefined =>
  POR_VENCER_DIAS.find((dias) => String(dias) === value);

/**
 * Lee los filtros del listado global de contratos de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL y las funciones para modificarlos
 *
 * @remarks
 * La URL es la fuente de la verdad. Los valores inválidos se ignoran. Con
 * "Por vencer" el backend fuerza el estado Vigente, por eso en ese caso
 * `filters` no lleva `estado`. Cualquier cambio de filtro vuelve a la primera página.
 */
export function useContratosFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const porVencer = parsePorVencer(searchParams.get("por_vencer_dias"));
  const estado = parseEstado(searchParams.get("estado"));

  const filters: ContratoFilters = {
    page,
    limit,
    search: searchParams.get("search")?.trim() || undefined,
    estado: porVencer ? undefined : estado,
    area_id: parseUuid(searchParams.get("area_id")),
    por_vencer_dias: porVencer,
  };

  const hasActiveFilters =
    filters.search !== undefined ||
    filters.estado !== undefined ||
    filters.area_id !== undefined ||
    filters.por_vencer_dias !== undefined;

  const setSearch = (search: string) => {
    updateParams({ search: search.trim() || undefined, page: undefined });
  };

  const setFilter = (key: ContratoFilterKey, value: string | undefined) => {
    updateParams({
      [key]: value || undefined,
      page: undefined,
      // Con "Por vencer" el estado queda fijo en Vigente: no se guarda otro
      ...(key === "por_vencer_dias" && Boolean(value) && { estado: undefined }),
    });
  };

  const clearFilters = () => {
    updateParams({
      search: undefined,
      estado: undefined,
      area_id: undefined,
      por_vencer_dias: undefined,
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
