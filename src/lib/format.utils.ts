const EMPTY_VALUE = "--";

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

/**
 * Convierte una fecha ISO a formato dd/MM/yyyy
 *
 * @param isoDate - Fecha como texto (YYYY-MM-DD o ISO completo)
 * @returns La fecha formateada, o un guion si no hay fecha
 */
export const formatDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return EMPTY_VALUE;

  const [year, month, day] = isoDate.slice(0, 10).split("-");

  return `${day}/${month}/${year}`;
};

/**
 * Da formato de soles a un monto
 *
 * @param amount - Monto como numero o texto (el backend envia los Decimal como texto)
 * @returns El monto formateado, o un guion si no hay un valor válido
 */
export const formatCurrency = (
  amount: string | number | null | undefined,
): string => {
  if (amount === null || amount === undefined || amount === "")
    return EMPTY_VALUE;

  const value = Number(amount);

  return Number.isNaN(value) ? EMPTY_VALUE : currencyFormatter.format(value);
};
