import type { AccionNovedad, NovedadPlanilla } from "../types/novedades.types";

/** Estado de disponibilidad de una acción sobre una novedad */
export interface AccionNovedadEstado {
  accion: AccionNovedad;
  disponible: boolean;
  motivo?: string;
}

const MOTIVO_DSO_APROBADO =
  "Ya hay un descuento por descanso semanal aprobado en este mes. Anúlalo antes de aprobar otro.";

/**
 * Calcula qué acciones ofrece una novedad según su estado y las demás del mes
 *
 * @remarks
 * Solo puede haber un descuento por descanso semanal aprobado por colaborador y
 * mes; aprobar un segundo queda deshabilitado con su explicación.
 */
export const getAccionesNovedad = (
  novedad: NovedadPlanilla,
  novedades: readonly NovedadPlanilla[],
): AccionNovedadEstado[] => {
  if (novedad.estado === "RECHAZADO" || novedad.estado === "ANULADO") {
    return [];
  }

  if (novedad.estado === "APROBADO") {
    return [{ accion: "ANULADO", disponible: true }];
  }

  const tieneOtroDsoAprobado =
    novedad.tipo === "DESCUENTO_DSO" &&
    novedades.some(
      (item) =>
        item.id !== novedad.id &&
        item.tipo === "DESCUENTO_DSO" &&
        item.estado === "APROBADO",
    );

  return [
    {
      accion: "APROBADO",
      disponible: !tieneOtroDsoAprobado,
      motivo: tieneOtroDsoAprobado ? MOTIVO_DSO_APROBADO : undefined,
    },
    { accion: "RECHAZADO", disponible: true },
    { accion: "ANULADO", disponible: true },
  ];
};

/** Cuenta cuántas novedades siguen pendientes de resolución */
export const contarPendientes = (
  novedades: readonly NovedadPlanilla[],
): number => novedades.filter((novedad) => novedad.estado === "PENDIENTE").length;

/**
 * Indica si alguna novedad aprobada o anulada se modificó después de la fecha dada
 *
 * @remarks
 * Sirve para avisar que hubo aprobaciones o anulaciones posteriores al último
 * cálculo y conviene recalcular. Se incluyen las anuladas porque pudieron estar
 * aprobadas antes (el listado no lo distingue) y se excluyen las rechazadas
 * porque nunca afectan la planilla.
 */
export const hayCambiosDespuesDe = (
  novedades: readonly NovedadPlanilla[],
  fechaIso: string,
): boolean => {
  const fechaReferencia = Date.parse(fechaIso);
  if (Number.isNaN(fechaReferencia)) return false;

  return novedades.some(
    (novedad) =>
      (novedad.estado === "APROBADO" || novedad.estado === "ANULADO") &&
      Date.parse(novedad.updated_at) > fechaReferencia,
  );
};
