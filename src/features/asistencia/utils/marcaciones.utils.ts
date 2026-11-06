import { formatPeriodo } from "./asistencia.utils";

const ZONA_HORARIA_LIMA = "America/Lima";

const fechaLimaFormatter = new Intl.DateTimeFormat("es-PE", {
  timeZone: ZONA_HORARIA_LIMA,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const horaLimaFormatter = new Intl.DateTimeFormat("es-PE", {
  timeZone: ZONA_HORARIA_LIMA,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/**
 * Fecha de una marcación en hora de Lima
 *
 * @param isoUtc - Fecha y hora ISO en UTC, como la envía el backend
 * @example formatFechaLima("2026-03-02T13:05:00.000Z") // "02/03/2026"
 */
export const formatFechaLima = (isoUtc: string): string =>
  fechaLimaFormatter.format(new Date(isoUtc));

/**
 * Hora de una marcación en hora de Lima (24 horas)
 *
 * @param isoUtc - Fecha y hora ISO en UTC, como la envía el backend
 * @example formatHoraLima("2026-03-02T13:05:00.000Z") // "08:05:00"
 */
export const formatHoraLima = (isoUtc: string): string =>
  horaLimaFormatter.format(new Date(isoUtc));

/**
 * Período para un título, con la primera letra en mayúscula
 *
 * @example formatPeriodoTitulo("2026-03") // "Marzo 2026"
 */
export const formatPeriodoTitulo = (periodo: string): string => {
  const texto = formatPeriodo(periodo).replace(" de ", " ");

  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
