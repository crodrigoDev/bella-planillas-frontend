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
  nombre_completo,
}: Pick<Empleado, "nombre_completo">): string => toTitleCase(nombre_completo);

/**
 * Obtiene las iniciales de un empleado
 *
 * @example "CM" para "Carlos Andrés" y "Méndez Ruiz"
 *
 * @remarks
 * El listado solo trae el nombre completo, así que se toma la primera letra de la
 * primera y de la última palabra. Si el backend envía nombre y apellido por
 * separado (la ficha), se usan esos.
 */
export const getIniciales = ({
  nombre,
  apellido,
  nombre_completo,
}: Pick<Empleado, "nombre" | "apellido" | "nombre_completo">): string => {
  const palabras = nombre_completo.trim().split(/\s+/);
  const primera = nombre?.trim() || palabras[0] || "";
  const segunda = apellido?.trim() || (palabras.length > 1 ? palabras.at(-1)! : "");

  return `${primera.charAt(0)}${segunda.charAt(0)}`.toLocaleUpperCase("es-PE");
};
