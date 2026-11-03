import { getTodayIsoDate } from "@/lib/date.utils";
import { formatDate } from "@/lib/format.utils";

/**
 * Fecha escrita con el mes en letras
 *
 * @example formatFechaLarga("2026-05-01") // "1 de mayo de 2026"
 */
export const formatFechaLarga = (fecha: string): string => {
  const [year, month, day] = fecha.slice(0, 10).split("-").map(Number);
  const mes = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
    "es-PE",
    { month: "long", timeZone: "UTC" },
  );

  return `${day} de ${mes} de ${year}`;
};

/** Meses completos entre dos fechas YYYY-MM-DD, contando el último día */
const getMeses = (desde: string, hasta: string): number => {
  const [y1, m1, d1] = desde.split("-").map(Number);
  const [y2, m2, d2] = hasta.split("-").map(Number);
  const meses = (y2 - y1) * 12 + (m2 - m1) + (d2 >= d1 - 1 ? 0 : -1);

  return Math.max(meses, 0);
};

/** Meses como texto: "menos de 1 mes", "2 meses", "1 año y 3 meses" */
const formatMeses = (meses: number): string => {
  if (meses < 1) return "menos de 1 mes";
  if (meses < 12) return meses === 1 ? "1 mes" : `${meses} meses`;

  const años = Math.floor(meses / 12);
  const resto = meses % 12;
  const textoAños = años === 1 ? "1 año" : `${años} años`;

  if (!resto) return textoAños;

  return `${textoAños} y ${resto === 1 ? "1 mes" : `${resto} meses`}`;
};

/**
 * Cuánto rigió lo que cambió un evento
 *
 * @param desde - Fecha del evento (YYYY-MM-DD)
 * @param hasta - Fecha hasta la que rigió; `null` si sigue vigente
 * @returns El texto de duración, por ejemplo "9 meses (hasta el 30/04/2026)"
 *
 * @example formatDuracion("2025-12-01", null) // "Vigente hace 11 meses"
 */
export const formatDuracion = (desde: string, hasta: string | null): string => {
  if (hasta === null)
    return `Vigente hace ${formatMeses(getMeses(desde, getTodayIsoDate()))}`;

  return `${formatMeses(getMeses(desde, hasta))} (hasta el ${formatDate(hasta)})`;
};
