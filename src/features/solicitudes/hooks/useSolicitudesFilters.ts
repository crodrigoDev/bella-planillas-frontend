import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { parseUuid } from "@/lib/urlParams.utils";
import {
  ESTADOS_SOLICITUD,
  TIPOS_SOLICITUD,
} from "../config/solicitudes.config";
import type {
  EstadoSolicitud,
  SolicitudFilterKey,
  SolicitudFilters,
  TipoSolicitud,
} from "../types/solicitudes.types";

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Ignora las fechas con otro formato para no mandar una consulta que el backend rechazaría */
const parseFecha = (value: string | null): string | undefined =>
  value && FECHA_REGEX.test(value) ? value : undefined;

/** Devuelve el valor de la URL solo si es una de las opciones; si no, sin filtro */
const parseOption = <T extends string>(
  value: string | null,
  options: readonly T[],
): T | undefined => options.find((option) => option === value);

/**
 * Lee los filtros del listado de solicitudes de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL y las funciones para modificarlos
 *
 * @remarks
 * El estado es la pestaña del listado y no cuenta como filtro activo (no se
 * quita con "Limpiar filtros"). Si la fecha inicial es posterior a la final
 * (solo pasa al editar la URL a mano), se descartan las dos fechas.
 * Cualquier cambio de filtro vuelve a la primera página.
 */
export function useSolicitudesFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const fechaDesde = parseFecha(searchParams.get("fecha_desde"));
  const fechaHasta = parseFecha(searchParams.get("fecha_hasta"));
  const rangoInvertido =
    fechaDesde !== undefined &&
    fechaHasta !== undefined &&
    fechaDesde > fechaHasta;

  const filters: SolicitudFilters = {
    page,
    limit,
    search: searchParams.get("search") || undefined,
    estado: parseOption<EstadoSolicitud>(
      searchParams.get("estado"),
      ESTADOS_SOLICITUD,
    ),
    tipo: parseOption<TipoSolicitud>(searchParams.get("tipo"), TIPOS_SOLICITUD),
    area_id: parseUuid(searchParams.get("area_id")),
    fecha_desde: rangoInvertido ? undefined : fechaDesde,
    fecha_hasta: rangoInvertido ? undefined : fechaHasta,
  };

  const hasActiveFilters =
    filters.search !== undefined ||
    filters.tipo !== undefined ||
    filters.area_id !== undefined ||
    filters.fecha_desde !== undefined ||
    filters.fecha_hasta !== undefined;

  const setFilter = (key: SolicitudFilterKey, value: string | undefined) => {
    updateParams({ [key]: value || undefined, page: undefined });
  };

  /** Cambia el rango de fechas de una vez y vuelve a la primera página */
  const setFechas = (desde: string | undefined, hasta: string | undefined) => {
    updateParams({ fecha_desde: desde, fecha_hasta: hasta, page: undefined });
  };

  const clearFilters = () => {
    updateParams({
      search: undefined,
      tipo: undefined,
      area_id: undefined,
      fecha_desde: undefined,
      fecha_hasta: undefined,
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
