import type { Empleado } from "../types/empleados.types";

const TURNO_LABELS: Record<string, string> = {
  MANANA: "Mañana",
  TARDE: "Tarde",
  NOCHE: "Noche",
  MIXTO: "Mixto",
  ROTATIVO: "Rotativo",
};

/**
 * Convierte el turno de una jornada en un texto para mostrar
 *
 * @param turno - Valor que envía el backend, por ejemplo `MANANA`
 * @returns El texto legible; un turno desconocido se devuelve tal cual
 */
export const formatTurno = (turno: string): string =>
  TURNO_LABELS[turno] ?? turno;

/**
 * Arma el nombre completo de un empleado, como lo muestra el diseño
 *
 * @example "Carlos Andrés Méndez Ruiz"
 */
export const getNombreCompleto = ({
  nombre,
  apellido,
}: Pick<Empleado, "nombre" | "apellido">): string => `${nombre} ${apellido}`;
