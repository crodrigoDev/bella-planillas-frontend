import { getTodayIsoDate } from "@/lib/date.utils";
import type { DiaAsistencia, ResumenMes } from "../types/asistencia.types";
import { ALERTA_SIN_JORNADA, ZONA_LIMA } from "../config/asistencia.config";

/** Si el backend no pudo evaluar el día porque no hay jornada asignada */
export const esDiaSinJornada = (dia: DiaAsistencia): boolean =>
  dia.alertas.includes(ALERTA_SIN_JORNADA);

/**
 * Por qué no se puede aprobar un resumen pendiente, o null si se puede
 *
 * @remarks
 * Son las mismas condiciones que exige el backend: resumen vigente, completo
 * y sin días por resolver. Los días sin jornada también cuentan como pendientes
 * en el backend, pero no se pueden resolver: el motivo manda a asignar la jornada.
 */
export const getMotivoNoAprobable = (resumen: ResumenMes): string | null => {
  if (resumen.estado !== "PENDIENTE") return null;
  if (!resumen.vigente)
    return "El resumen está desactualizado: actualízalo para poder aprobarlo.";
  const sinJornada = resumen.detalle?.dias.filter(esDiaSinJornada).length ?? 0;
  if (sinJornada > 0)
    return `Hay ${sinJornada} ${sinJornada === 1 ? "día" : "días"} sin jornada asignada: asigna una jornada y actualiza el resumen para poder aprobarlo.`;
  if (resumen.pendientes > 0)
    return `Hay ${resumen.pendientes} ${resumen.pendientes === 1 ? "día" : "días"} por resolver antes de aprobar.`;
  if (!resumen.completo)
    return "Todavía hay días sin evaluar: se podrá aprobar cuando el mes esté completo.";

  return null;
};

/** Mes de hoy como YYYY-MM */
export const getPeriodoActual = (): string => getTodayIsoDate().slice(0, 7);

/** Mueve un mes (YYYY-MM) hacia adelante o hacia atrás */
export const shiftPeriodo = (periodo: string, meses: number): string => {
  const [year, month] = periodo.split("-").map(Number);
  const fecha = new Date(Date.UTC(year, month - 1 + meses, 1));

  return fecha.toISOString().slice(0, 7);
};

/**
 * Nombre de un mes para mostrar
 *
 * @example formatPeriodo("2026-11") // "noviembre de 2026"
 */
export const formatPeriodo = (periodo: string): string => {
  const [year, month] = periodo.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

/** Primer y último día de un mes (YYYY-MM-DD), para limitar los campos de fecha */
export const getRangoPeriodo = (
  periodo: string,
): { inicio: string; fin: string } => {
  const [year, month] = periodo.split("-").map(Number);
  const ultimo = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return {
    inicio: `${periodo}-01`,
    fin: `${periodo}-${String(ultimo).padStart(2, "0")}`,
  };
};

/**
 * Día de la semana y número de una fecha
 *
 * @example formatDia("2026-11-02") // "lun 02"
 */
export const formatDia = (fecha: string): string => {
  const [year, month, day] = fecha.split("-").map(Number);
  const dia = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    "es-PE",
    { weekday: "short", timeZone: "UTC" },
  );

  return `${dia.replace(".", "")} ${String(day).padStart(2, "0")}`;
};

/**
 * Fecha para la tabla del mes: día de la semana y fecha completa
 *
 * @example formatFechaCompleta("2026-10-01") // "Jue 01/10/2026"
 */
export const formatFechaCompleta = (fecha: string): string => {
  const [year, month, day] = fecha.split("-").map(Number);
  const dia = new Date(Date.UTC(year, month - 1, day))
    .toLocaleDateString("es-PE", { weekday: "short", timeZone: "UTC" })
    .replace(".", "");

  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
};

/**
 * Minutos como horas y minutos
 *
 * @example formatMinutos(80) // "1 h 20 min"
 */
export const formatMinutos = (minutos: number): string => {
  if (minutos <= 0) return "0 min";

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  if (!horas) return `${resto} min`;

  return resto ? `${horas} h ${resto} min` : `${horas} h`;
};

/**
 * Fecha y hora de una marcación como la pide el backend: con la zona de Lima
 *
 * @example toFechaHoraLima("2026-11-02", "08:05") // "2026-11-02T08:05:00-05:00"
 */
export const toFechaHoraLima = (fecha: string, hora: string): string =>
  `${fecha}T${hora}:00${ZONA_LIMA}`;

/** Convierte un código del backend en texto legible si no hay uno escrito */
export const humanizarCodigo = (codigo: string): string => {
  const texto = codigo.toLowerCase().replaceAll("_", " ");

  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
