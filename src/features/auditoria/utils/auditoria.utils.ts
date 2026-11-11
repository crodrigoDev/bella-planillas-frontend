import type { AuditoriaLog } from "../types/auditoria.types";

/**
 * Nombre de quien hizo la acción: el del colaborador, el correo si no tiene
 * colaborador y "Sistema" si no hay usuario
 */
export const getUsuarioNombre = (log: AuditoriaLog): string => {
  if (!log.usuarios) return "Sistema";

  const { empleados, email } = log.usuarios;

  return empleados ? `${empleados.nombre} ${empleados.apellido}` : email;
};

/** Primeros 8 caracteres de un id, para mostrarlo en una celda */
export const shortId = (id: string): string => id.slice(0, 8);
