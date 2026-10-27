/**
 * Cambios a aplicar sobre los parámetros de la URL
 *
 * @remarks
 * Un valor `undefined` quita el parámetro.
 */
export type ParamChanges = Record<string, string | undefined>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Convierte el texto de la URL en número de página válido
 *
 * @returns El número de página, o 1 si el texto no es un entero positivo
 */
export const parsePage = (value: string | null): number => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

/**
 * Convierte el texto de la URL en una cantidad de filas por página permitida
 *
 * @param allowed - Cantidades que se pueden elegir
 * @param fallback - Cantidad a usar si el texto no es una de las permitidas
 */
export const parseLimit = (
  value: string | null,
  allowed: readonly number[],
  fallback: number,
): number => {
  const limit = Number(value);

  return allowed.includes(limit) ? limit : fallback;
};

/**
 * Ignora los uuid inválidos para no mandar una consulta al backend que rechazara
 */
export const parseUuid = (value: string | null): string | undefined =>
  value && UUID_REGEX.test(value) ? value : undefined;

/**
 * Convierte el texto de la URL en un booleano válido
 *
 * @returns El booleano, o undefined si el texto es otro (sin filtro)
 */
export const parseBoolean = (value: string | null): boolean | undefined => {
  if (value === "true") return true;
  if (value === "false") return false;

  return undefined;
};

/**
 * Crea unos nuevos parámetros de URL con los cambios aplicados
 *
 * @param current - Parámetros actuales, que no se modifican
 * @param changes - Valores a poner, `undefined` quita el parámetro
 */
export const applyParamChanges = (
  current: URLSearchParams,
  changes: ParamChanges,
) => {
  const next = new URLSearchParams(current);

  Object.entries(changes).forEach(([key, value]) => {
    if (value === undefined) next.delete(key);
    else next.set(key, value);
  });

  return next;
};
