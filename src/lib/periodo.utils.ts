import { getTodayIsoDate } from "@/lib/date.utils";

const PERIODO_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Mes de hoy como YYYY-MM */
export const getPeriodoActual = (): string => getTodayIsoDate().slice(0, 7);

/** Lee un mes (YYYY-MM) de la URL; solo acepta uno válido que no sea futuro */
export const parsePeriodo = (value: string | null): string | undefined =>
  value && PERIODO_REGEX.test(value) && value <= getPeriodoActual()
    ? value
    : undefined;

/** Mueve un mes (YYYY-MM) hacia adelante o hacia atrás */
export const shiftPeriodo = (periodo: string, meses: number): string => {
  const [year, month] = periodo.split("-").map(Number);
  const fecha = new Date(Date.UTC(year, month - 1 + meses, 1));

  return fecha.toISOString().slice(0, 7);
};

/**
 * Nombre de un mes para mostrar
 *
 * @example formatPeriodo("2026-09") // "septiembre de 2026"
 */
export const formatPeriodo = (periodo: string): string => {
  const [year, month] = periodo.split("-").map(Number);

  // "es-PE" devuelve "setiembre" en el navegador; con "es" sale "septiembre"
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("es", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};
