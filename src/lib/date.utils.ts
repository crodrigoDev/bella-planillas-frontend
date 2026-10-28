/**
 * Obtiene la fecha de hoy como YYYY-MM-DD en la zona horaria del navegador
 *
 * @returns El texto que usan los campos `<input type="date">` y el backend
 *
 * @remarks
 * No usa `toISOString()` porque devuelve la fecha en UTC y en Perú (UTC-5)
 * mostraría el día siguiente después de las 19:00.
 */
export const getTodayIsoDate = (): string => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
};
