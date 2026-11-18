import type { Contrato } from "../types/contratos.types";

/**
 * Un contrato con PDF adjunto ya no se puede editar
 *
 * @remarks
 * El backend rechaza editar cuando hay PDF, pero no valida el estado.
 */
export const puedeEditar = (contrato: Contrato): boolean =>
  !contrato.tiene_archivo;

/** Solo se adjunta un PDF una vez; no se reemplaza */
export const puedeSubirPdf = (contrato: Contrato): boolean =>
  !contrato.tiene_archivo;

/**
 * El backend solo rechaza renovar un contrato ya renovado o de un empleado
 * inactivo
 */
export const puedeRenovar = (
  contrato: Contrato,
  empleadoActivo: boolean,
): boolean => empleadoActivo && contrato.estado !== "RENOVADO";

/** Saca el nombre del archivo de la ruta que guarda el backend */
export const getNombreArchivo = (url: string): string =>
  url.split("/").pop() ?? url;

/**
 * Devuelve el día siguiente a una fecha YYYY-MM-DD
 *
 * @remarks
 * Usa UTC para que la zona horaria no mueva el día.
 */
export const getDiaSiguiente = (isoDate: string): string => {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));

  return next.toISOString().slice(0, 10);
};

const toUtcMs = (isoDate: string): number => {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);

  return Date.UTC(year, month - 1, day);
};

/**
 * Qué parte de un contrato ya transcurrió, de 0 a 100
 *
 * @returns El porcentaje, o null si el contrato no tiene fecha de fin
 */
export const getProgresoContrato = (
  fechaInicio: string,
  fechaFin: string | null,
  hoy: string,
): number | null => {
  if (!fechaFin) return null;

  const inicio = toUtcMs(fechaInicio);
  const total = toUtcMs(fechaFin) - inicio;

  if (total <= 0) return 100;

  const avance = ((toUtcMs(hoy) - inicio) / total) * 100;

  return Math.min(100, Math.max(0, avance));
};

/** Aviso de vencimiento de un contrato vigente con fecha de fin */
export type VencimientoContrato =
  | { tipo: "vencido"; dias: number }
  | {
      tipo: "porVencer";
      dias: number;
      alerta: Contrato["alerta_vencimiento"];
    };

/**
 * Calcula el aviso de vencimiento de un contrato
 *
 * @returns El aviso, o null si no es vigente o no tiene fecha de fin
 *
 * @remarks
 * El backend no cambia el estado al pasar la fecha de fin: un contrato sigue
 * Vigente aunque ya haya vencido, y `dias_restantes` sale negativo.
 */
export const getVencimientoContrato = (
  contrato: Pick<Contrato, "estado" | "dias_restantes" | "alerta_vencimiento">,
): VencimientoContrato | null => {
  const { estado, dias_restantes, alerta_vencimiento } = contrato;

  if (estado !== "VIGENTE" || dias_restantes === null) return null;
  if (dias_restantes < 0)
    return { tipo: "vencido", dias: Math.abs(dias_restantes) };

  return { tipo: "porVencer", dias: dias_restantes, alerta: alerta_vencimiento };
};
