/**
 * Convierte un texto YYYY-MM-DD en una fecha local
 *
 * @returns La fecha a medianoche hora local, o `undefined` si no hay texto
 *
 * @remarks
 * No pasa por UTC, para no correr un día.
 */
export const parseIsoDate = (iso: string | undefined): Date | undefined => {
  if (!iso) return undefined;

  const [year, month, day] = iso.split("-").map(Number);

  return new Date(year, month - 1, day);
};

/**
 * Convierte una fecha local en texto YYYY-MM-DD
 *
 * @remarks
 * Usa año, mes y día locales, no `toISOString()`, que da el día en UTC.
 */
export const toIsoDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

/**
 * Obtiene la fecha de hoy como YYYY-MM-DD en la zona horaria del navegador
 *
 * @returns El texto que usan los campos `<input type="date">` y el backend
 *
 * @remarks
 * No usa `toISOString()` porque devuelve la fecha en UTC y en Perú (UTC-5)
 * mostraría el día siguiente después de las 19:00.
 */
export const getTodayIsoDate = (): string => toIsoDate(new Date());

/**
 * Recorta una fecha ISO a AAAA-MM-DD, el único formato que acepta `<input type="date">`
 *
 * @returns La fecha recortada, o texto vacío si no hay fecha
 */
export const toDateInput = (isoDate: string | null | undefined): string =>
  isoDate?.slice(0, 10) ?? "";

/**
 * Calcula los años cumplidos entre una fecha de nacimiento y otra fecha
 *
 * @param birthIsoDate - Fecha de nacimiento (YYYY-MM-DD)
 * @param referenceIsoDate - Fecha hasta la que se cuenta; por defecto, hoy
 * @returns Los años cumplidos; negativo si la fecha de nacimiento es futura
 *
 * @remarks
 * Compara año, mes y día como números, sin usar `Date`, para no depender de
 * la zona horaria.
 */
export const getAge = (
  birthIsoDate: string,
  referenceIsoDate: string = getTodayIsoDate(),
): number => {
  const [birthYear, birthMonth, birthDay] = birthIsoDate.split("-").map(Number);
  const [year, month, day] = referenceIsoDate.split("-").map(Number);

  const hadBirthday =
    month > birthMonth || (month === birthMonth && day >= birthDay);

  return year - birthYear - (hadBirthday ? 0 : 1);
};

/**
 * Escribe una fecha y hora con la zona de Lima, por ejemplo "05/03/2026, 14:30"
 *
 * @param iso - Instante completo con zona (el historial y `created_at`)
 */
export const formatFechaHoraLima = (iso: string): string =>
  new Date(iso).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
