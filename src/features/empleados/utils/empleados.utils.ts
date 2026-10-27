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
