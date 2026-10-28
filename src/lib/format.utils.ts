const EMPTY_VALUE = "--";

/**
 * Convierte una fecha ISO a formato dd/MM/yyyy
 *
 * @param isoDate - Fecha como texto (YYYY-MM-DD o ISO completo)
 * @returns La fecha formateada, o un guion si no hay fecha
 *
 * @remarks
 * No usa `Date` a propósito: una fecha sin hora llega como medianoche UTC
 * y en Perú (UTC-5) se mostraría un día antes.
 */
export const formatDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return EMPTY_VALUE;

  const [year, month, day] = isoDate.slice(0, 10).split("-");

  return `${day}/${month}/${year}`;
};
