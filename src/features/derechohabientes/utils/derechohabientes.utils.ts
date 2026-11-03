/** Las dos iniciales de un nombre, para el círculo de la tarjeta */
export const getIniciales = (nombres: string, apellidos: string): string =>
  `${nombres.trim().charAt(0)}${apellidos.trim().charAt(0)}`.toUpperCase();
