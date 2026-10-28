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
