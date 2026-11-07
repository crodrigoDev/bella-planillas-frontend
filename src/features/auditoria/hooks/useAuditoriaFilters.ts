import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { parseUuid } from "@/lib/urlParams.utils";
import type {
  AuditoriaFilterKey,
  AuditoriaFilters,
} from "../types/auditoria.types";

/**
 * Lee los filtros de la bitácora de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL, el correo del usuario filtrado (solo para
 * la etiqueta) y las funciones para modificarlos
 *
 * @remarks
 * Módulo y acción se envían tal cual: el backend los acepta como texto. El
 * usuario se filtra desde una fila (`filtrarPorUsuario`) y se guarda su correo
 * en la URL junto al id, porque no hay endpoint para consultarlo después.
 * Un id que no sea uuid se ignora. Cualquier cambio vuelve a la primera página.
 */
export function useAuditoriaFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const filters: AuditoriaFilters = {
    page,
    limit,
    tabla_afectada: searchParams.get("tabla_afectada") || undefined,
    accion: searchParams.get("accion") || undefined,
    usuario_id: parseUuid(searchParams.get("usuario_id")),
    registro_id: parseUuid(searchParams.get("registro_id")),
  };

  const usuarioEmail = filters.usuario_id
    ? searchParams.get("usuario") || undefined
    : undefined;

  const hasActiveFilters =
    filters.tabla_afectada !== undefined ||
    filters.accion !== undefined ||
    filters.usuario_id !== undefined ||
    filters.registro_id !== undefined;

  const setFilter = (key: AuditoriaFilterKey, value: string | undefined) => {
    updateParams({ [key]: value || undefined, page: undefined });
  };

  /** Filtra por el usuario de una fila; `email` solo sirve para la etiqueta */
  const filtrarPorUsuario = (usuarioId: string, email: string) => {
    updateParams({ usuario_id: usuarioId, usuario: email, page: undefined });
  };

  const quitarUsuario = () => {
    updateParams({
      usuario_id: undefined,
      usuario: undefined,
      page: undefined,
    });
  };

  const quitarRegistro = () => {
    updateParams({ registro_id: undefined, page: undefined });
  };

  const clearFilters = () => {
    updateParams({
      tabla_afectada: undefined,
      accion: undefined,
      usuario_id: undefined,
      usuario: undefined,
      registro_id: undefined,
      page: undefined,
    });
  };

  return {
    filters,
    usuarioEmail,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    filtrarPorUsuario,
    quitarUsuario,
    quitarRegistro,
    clearFilters,
  };
}
