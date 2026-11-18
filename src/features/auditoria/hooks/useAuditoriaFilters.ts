import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { parseIsoDate, toIsoDate } from "@/lib/date.utils";
import { parseUuid } from "@/lib/urlParams.utils";
import { TIPOS_AFECTADO } from "../config/auditoria.config";
import type {
  AuditoriaFilterKey,
  AuditoriaFilters,
  TipoAfectadoAuditoria,
} from "../types/auditoria.types";

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Ignora las fechas con otro formato o que no existen (`2026-02-31`): el backend las rechazaría */
const parseFecha = (value: string | null): string | undefined => {
  if (!value || !FECHA_REGEX.test(value)) return undefined;

  const fecha = parseIsoDate(value);

  return fecha && toIsoDate(fecha) === value ? value : undefined;
};

/** Devuelve el tipo de afectado de la URL solo si es uno conocido */
const parseTipoAfectado = (
  value: string | null,
): TipoAfectadoAuditoria | undefined =>
  TIPOS_AFECTADO.find((tipo) => tipo === value);

/**
 * Lee los filtros de la actividad de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL, los nombres del usuario y del afectado
 * filtrados (solo para la etiqueta) y las funciones para modificarlos
 *
 * @remarks
 * Módulo y acción se envían tal cual: el backend los acepta como texto. El
 * usuario y el afectado se filtran desde una fila y se guarda su nombre en la
 * URL junto al id, porque no hay endpoint para consultarlo después; el afectado
 * guarda además su tipo, y solo cuenta si vienen el tipo y un id válido. Un id
 * que no sea uuid se ignora. Si la fecha inicial es posterior a la final (solo
 * pasa al editar la URL a mano), se descartan las dos. Cualquier cambio vuelve
 * a la primera página.
 */
export function useAuditoriaFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const desde = parseFecha(searchParams.get("desde"));
  const hasta = parseFecha(searchParams.get("hasta"));
  const rangoInvertido =
    desde !== undefined && hasta !== undefined && desde > hasta;

  const afectadoTipo = parseTipoAfectado(searchParams.get("afectado_tipo"));
  const afectadoId = parseUuid(searchParams.get("afectado_id"));
  const hayAfectado = afectadoTipo !== undefined && afectadoId !== undefined;

  const filters: AuditoriaFilters = {
    page,
    limit,
    tabla_afectada: searchParams.get("tabla_afectada") || undefined,
    accion: searchParams.get("accion") || undefined,
    usuario_id: parseUuid(searchParams.get("usuario_id")),
    afectado_tipo: hayAfectado ? afectadoTipo : undefined,
    afectado_id: hayAfectado ? afectadoId : undefined,
    desde: rangoInvertido ? undefined : desde,
    hasta: rangoInvertido ? undefined : hasta,
  };

  const usuarioNombre = filters.usuario_id
    ? searchParams.get("usuario") || undefined
    : undefined;
  const afectadoNombre = hayAfectado
    ? searchParams.get("afectado") || undefined
    : undefined;

  const hasActiveFilters =
    filters.tabla_afectada !== undefined ||
    filters.accion !== undefined ||
    filters.usuario_id !== undefined ||
    filters.afectado_id !== undefined ||
    filters.desde !== undefined ||
    filters.hasta !== undefined;

  const setFilter = (key: AuditoriaFilterKey, value: string | undefined) => {
    updateParams({ [key]: value || undefined, page: undefined });
  };

  /** Cambia el rango de fechas de una vez y vuelve a la primera página */
  const setFechas = (nuevaDesde: string | undefined, nuevaHasta: string | undefined) => {
    updateParams({ desde: nuevaDesde, hasta: nuevaHasta, page: undefined });
  };

  /** Filtra por el usuario de una fila; `nombre` solo sirve para la etiqueta */
  const filtrarPorUsuario = (usuarioId: string, nombre: string) => {
    updateParams({ usuario_id: usuarioId, usuario: nombre, page: undefined });
  };

  const quitarUsuario = () => {
    updateParams({
      usuario_id: undefined,
      usuario: undefined,
      page: undefined,
    });
  };

  /** Filtra por el afectado de una fila; `nombre` solo sirve para la etiqueta */
  const filtrarPorAfectado = (
    tipo: TipoAfectadoAuditoria,
    id: string,
    nombre: string,
  ) => {
    updateParams({
      afectado_tipo: tipo,
      afectado_id: id,
      afectado: nombre,
      page: undefined,
    });
  };

  const quitarAfectado = () => {
    updateParams({
      afectado_tipo: undefined,
      afectado_id: undefined,
      afectado: undefined,
      page: undefined,
    });
  };

  const clearFilters = () => {
    updateParams({
      tabla_afectada: undefined,
      accion: undefined,
      usuario_id: undefined,
      usuario: undefined,
      afectado_tipo: undefined,
      afectado_id: undefined,
      afectado: undefined,
      desde: undefined,
      hasta: undefined,
      page: undefined,
    });
  };

  return {
    filters,
    usuarioNombre,
    afectadoNombre,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    setFechas,
    filtrarPorUsuario,
    quitarUsuario,
    filtrarPorAfectado,
    quitarAfectado,
    clearFilters,
  };
}
