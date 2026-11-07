import { formatFechaHoraLima } from "@/lib/date.utils";
import {
  MAX_NOTIFICACIONES,
  MODULO_NOTIFICACION_CONFIG,
} from "../config/notificaciones.config";
import type { Notificacion } from "../types/notificaciones.types";

const MINUTO_MS = 60_000;
const HORA_MS = 60 * MINUTO_MS;
const DIA_MS = 24 * HORA_MS;

/**
 * Agrega una alerta al inicio sin repetir su `id` y sin pasar del máximo
 */
export const agregarNotificacion = (
  lista: Notificacion[],
  nueva: Notificacion,
): Notificacion[] =>
  [nueva, ...lista.filter((item) => item.id !== nueva.id)].slice(
    0,
    MAX_NOTIFICACIONES,
  );

/**
 * Indica si la alerta llegó después de la última vez que se abrió el panel
 *
 * @param vistoHasta - Fecha ISO de la última vista; `null` si nunca se abrió
 */
export const esNoLeida = (
  notificacion: Notificacion,
  vistoHasta: string | null,
): boolean =>
  vistoHasta === null ||
  new Date(notificacion.timestamp).getTime() > new Date(vistoHasta).getTime();

/** Cuenta las alertas no leídas de la lista */
export const contarNoLeidas = (
  lista: Notificacion[],
  vistoHasta: string | null,
): number => lista.filter((item) => esNoLeida(item, vistoHasta)).length;

/**
 * Escribe cuánto pasó desde la alerta: "hace 5 min", "hace 2 h", "ayer"
 * o la fecha cuando pasaron más de dos días
 */
export const formatTiempoRelativo = (
  iso: string,
  ahora: number = Date.now(),
): string => {
  const diferencia = Math.max(0, ahora - new Date(iso).getTime());

  if (diferencia < MINUTO_MS) return "hace un momento";
  if (diferencia < HORA_MS)
    return `hace ${Math.floor(diferencia / MINUTO_MS)} min`;
  if (diferencia < DIA_MS) return `hace ${Math.floor(diferencia / HORA_MS)} h`;
  if (diferencia < 2 * DIA_MS) return "ayer";

  return formatFechaHoraLima(iso);
};

/** Nombre legible del módulo; uno desconocido se muestra con su texto en minúsculas */
export const getNombreModulo = (modulo: string): string => {
  const conocido = MODULO_NOTIFICACION_CONFIG[modulo]?.nombre;
  if (conocido) return conocido;

  const texto = modulo.replaceAll("_", " ").toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

/** Ruta del módulo de origen o `undefined` si no tiene pantalla a la que ir */
export const getRutaModulo = (modulo: string): string | undefined =>
  MODULO_NOTIFICACION_CONFIG[modulo]?.ruta;
