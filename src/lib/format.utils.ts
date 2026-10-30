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

// Palabras que van en minúscula dentro de un nombre ("Juan de la Cruz")
const NAME_PARTICLES = new Set(["de", "del", "la", "las", "los", "y"]);

/**
 * Pasa un nombre en mayúsculas a "Nombre Propio" para mostrarlo
 *
 * @example toTitleCase("MARÍA DE LOS ÁNGELES") // "María de los Ángeles"
 *
 * @remarks
 * Solo cambia cómo se ve: el dato que se guarda y se envía no se modifica.
 */
export const toTitleCase = (name: string): string =>
  name
    .toLocaleLowerCase("es-PE")
    .split(" ")
    .map((word, index) =>
      index > 0 && NAME_PARTICLES.has(word)
        ? word
        : word.charAt(0).toLocaleUpperCase("es-PE") + word.slice(1),
    )
    .join(" ");

const currencyFormatter =new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

/**
 * Da formato de soles a un monto, por ejemplo "S/ 1,500.00"
 *
 * @returns El monto formateado, o un guion si no hay monto
 */
export const formatCurrency = (amount: number | null | undefined): string =>
  amount === null || amount === undefined
    ? EMPTY_VALUE
    : currencyFormatter.format(amount);

/**
 * Oculta un dato sensible y deja visibles solo sus últimos caracteres
 *
 * @param value - Dato a ocultar, por ejemplo un número de cuenta
 * @param visible - Cuántos caracteres del final se muestran
 * @returns El dato oculto ("•••• 1234"), o un guion si no hay dato
 */
export const maskEnd = (
  value: string | null | undefined,
  visible = 4,
): string => (value ? `•••• ${value.slice(-visible)}` : EMPTY_VALUE);
