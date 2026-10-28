import { toTitleCase } from "@/lib/format.utils";
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
 * Arma el nombre completo de un empleado para mostrarlo
 *
 * @example "Carlos Andrés Méndez Ruiz"
 *
 * @remarks
 * El backend guarda los nombres en mayúsculas; aquí se muestran como nombre propio.
 */
export const getNombreCompleto = ({
  nombre,
  apellido,
}: Pick<Empleado, "nombre" | "apellido">): string =>
  toTitleCase(`${nombre} ${apellido}`);

/**
 * Obtiene las iniciales de un empleado: la del primer nombre y la del primer apellido
 *
 * @example "CM" para "Carlos Andrés" y "Méndez Ruiz"
 */
export const getIniciales = ({
  nombre,
  apellido,
}: Pick<Empleado, "nombre" | "apellido">): string =>
  `${nombre.trim().charAt(0)}${apellido.trim().charAt(0)}`.toLocaleUpperCase(
    "es-PE",
  );
