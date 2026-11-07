import type {
  DuracionJornada,
  ModalidadJornada,
  TurnoJornada,
} from "@jyp/shared-contracts";

import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { parseUuid } from "@/lib/urlParams.utils";
import {
  DURACION_OPTIONS,
  MODALIDAD_OPTIONS,
  TURNO_OPTIONS,
} from "../config/jornadas.config";
import type { JornadaFilterKey, JornadaFilters } from "../types/jornadas.types";

/** Devuelve el valor de la URL solo si es una de las opciones; si no, sin filtro */
const parseOption = <T extends string>(
  value: string | null,
  options: { value: T }[],
): T | undefined => options.find((option) => option.value === value)?.value;

/**
 * Lee los filtros del listado de jornadas de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL y las funciones para modificarlos
 *
 * @remarks
 * Cualquier cambio de filtro vuelve a la primera página. Un valor de la URL
 * que no sea una opción válida se ignora.
 */
export function useJornadasFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const filters: JornadaFilters = {
    page,
    limit,
    search: searchParams.get("search") || undefined,
    area_id: parseUuid(searchParams.get("area_id")),
    turno: parseOption<TurnoJornada>(searchParams.get("turno"), TURNO_OPTIONS),
    modalidad: parseOption<ModalidadJornada>(
      searchParams.get("modalidad"),
      MODALIDAD_OPTIONS,
    ),
    duracion: parseOption<DuracionJornada>(
      searchParams.get("duracion"),
      DURACION_OPTIONS,
    ),
  };

  const hasActiveFilters =
    filters.search !== undefined ||
    filters.area_id !== undefined ||
    filters.turno !== undefined ||
    filters.modalidad !== undefined ||
    filters.duracion !== undefined;

  const setFilter = (key: JornadaFilterKey, value: string | undefined) => {
    updateParams({ [key]: value || undefined, page: undefined });
  };

  const clearFilters = () => {
    updateParams({
      search: undefined,
      area_id: undefined,
      turno: undefined,
      modalidad: undefined,
      duracion: undefined,
      page: undefined,
    });
  };

  return {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    clearFilters,
  };
}
