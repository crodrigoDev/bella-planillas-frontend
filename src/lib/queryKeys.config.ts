/**
 * Raíces de caché que más de una feature necesita invalidar
 *
 * @remarks
 * Una feature no importa de otra, así que las claves que se cruzan viven aquí
 * y no se repiten como texto: si una cambia, cambia en todos los usos.
 * Cada feature arma sus claves completas a partir de su raíz (`empleadosKey`).
 */
export const ROOT_KEYS = {
  empleados: ["empleados"] as const,
  catalogos: ["catalogos"] as const,
};
