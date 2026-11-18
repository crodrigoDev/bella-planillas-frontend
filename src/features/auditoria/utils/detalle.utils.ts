import { ROUTE_PATHS } from "@/app/routes/path";
import type { TipoAfectadoAuditoria } from "../types/auditoria.types";

/** Enlace "Volver" de la página de detalle: a dónde lleva y cómo se llama */
export interface DestinoVolver {
  to: string;
  label: string;
}

const VOLVER_A_AUDITORIA: DestinoVolver = {
  to: ROUTE_PATHS.auditoria,
  label: "Volver a Auditoría",
};

/**
 * Decide a dónde vuelve la página de detalle
 *
 * @param state - Estado de navegación; puede traer `volverA` (ruta con sus filtros)
 * @returns El listado de auditoría con sus filtros si se llegó de ahí, el historial
 * del colaborador si se llegó de su pestaña y, sin estado o con uno inválido, el
 * listado sin filtros
 *
 * @remarks
 * Solo acepta rutas internas: un texto que no empiece con una sola `/` se ignora.
 */
export const getDestinoVolver = (state: unknown): DestinoVolver => {
  const volverA =
    typeof state === "object" && state !== null && "volverA" in state
      ? state.volverA
      : undefined;

  if (typeof volverA !== "string") return VOLVER_A_AUDITORIA;
  if (!volverA.startsWith("/") || volverA.startsWith("//"))
    return VOLVER_A_AUDITORIA;

  if (volverA.startsWith(ROUTE_PATHS.auditoria))
    return { to: volverA, label: "Volver a Auditoría" };
  if (volverA.endsWith("/historial"))
    return { to: volverA, label: "Volver al historial" };

  return { to: volverA, label: "Volver" };
};

/**
 * Arma la ruta del listado de auditoría filtrado por un afectado
 *
 * @param nombre - Solo sirve para la etiqueta del filtro
 */
export const buildAuditoriaAfectadoPath = (
  tipo: TipoAfectadoAuditoria,
  id: string,
  nombre: string,
): string => {
  const params = new URLSearchParams({
    afectado_tipo: tipo,
    afectado_id: id,
    afectado: nombre,
  });

  return `${ROUTE_PATHS.auditoria}?${params.toString()}`;
};
