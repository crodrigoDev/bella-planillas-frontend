import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE_OPTIONS } from "@/components/data-table/dataTable.config";
import {
  applyParamChanges,
  parseLimit,
  parsePage,
  parseUuid,
  type ParamChanges,
} from "@/lib/urlParams.utils";
import type {
  MarcacionFilterKey,
  MarcacionFilters,
  TipoMarcaFiltro,
} from "../types/marcaciones.types";

const DEFAULT_LIMIT = PAGE_SIZE_OPTIONS[0];
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Ignora las fechas con otro formato para no mandar una consulta que el backend rechazaría */
const parseFecha = (value: string | null): string | undefined =>
  value && FECHA_REGEX.test(value) ? value : undefined;

const parseTipo = (value: string | null): TipoMarcaFiltro | undefined =>
  value === "ENTRADA" || value === "SALIDA" ? value : undefined;

/**
 * Lee los filtros del listado de marcaciones de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL y las funciones para modificarlos
 *
 * @remarks
 * La URL es la fuente de la verdad. Si la fecha inicial es posterior a la final
 * (solo pasa al editar la URL a mano), se descartan las dos fechas.
 * Cualquier cambio de filtro vuelve a la primera página.
 */
export function useMarcacionesFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const fechaInicio = parseFecha(searchParams.get("fecha_inicio"));
  const fechaFin = parseFecha(searchParams.get("fecha_fin"));
  const rangoInvertido =
    fechaInicio !== undefined && fechaFin !== undefined && fechaInicio > fechaFin;

  const filters: MarcacionFilters = {
    page: parsePage(searchParams.get("page")),
    limit: parseLimit(
      searchParams.get("limit"),
      PAGE_SIZE_OPTIONS,
      DEFAULT_LIMIT,
    ),
    empleado_id: parseUuid(searchParams.get("empleado_id")),
    fecha_inicio: rangoInvertido ? undefined : fechaInicio,
    fecha_fin: rangoInvertido ? undefined : fechaFin,
    tipo_marcacion: parseTipo(searchParams.get("tipo_marcacion")),
  };

  const hasActiveFilters =
    filters.empleado_id !== undefined ||
    filters.fecha_inicio !== undefined ||
    filters.fecha_fin !== undefined ||
    filters.tipo_marcacion !== undefined;

  const updateParams = (changes: ParamChanges, replace = false) => {
    setSearchParams((current) => applyParamChanges(current, changes), {
      replace,
    });
  };

  /**
   * Cambia de página
   *
   * @param replace - Reemplaza la entrada del historial en lugar de agregar otra
   */
  const setPage = (page: number, replace = false) => {
    updateParams({ page: page <= 1 ? undefined : String(page) }, replace);
  };

  /** Cambia la cantidad de filas por página y vuelve a la primera */
  const setLimit = (limit: number) => {
    updateParams({
      limit: limit === DEFAULT_LIMIT ? undefined : String(limit),
      page: undefined,
    });
  };

  const setFilter = (key: MarcacionFilterKey, value: string | undefined) => {
    updateParams({ [key]: value || undefined, page: undefined });
  };

  /** Cambia el rango de fechas de una vez y vuelve a la primera página */
  const setFechas = (inicio: string | undefined, fin: string | undefined) => {
    updateParams({ fecha_inicio: inicio, fecha_fin: fin, page: undefined });
  };

  const clearFilters = () => {
    updateParams({
      empleado_id: undefined,
      fecha_inicio: undefined,
      fecha_fin: undefined,
      tipo_marcacion: undefined,
      page: undefined,
    });
  };

  return {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    setFechas,
    clearFilters,
  };
}
