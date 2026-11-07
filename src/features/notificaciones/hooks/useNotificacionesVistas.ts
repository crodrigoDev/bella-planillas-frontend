import { useState } from "react";

const getStorageKey = (userId: string) => `notificaciones:visto:${userId}`;

/** Lee la fecha guardada; sin acceso a `localStorage` se trata como nunca vista */
const leerVistoHasta = (userId: string): string | null => {
  try {
    return localStorage.getItem(getStorageKey(userId));
  } catch {
    return null;
  }
};

/**
 * Recuerda por usuario la última vez que abrió el panel de notificaciones
 *
 * @remarks
 * El backend no marca alertas como leídas: la fecha vive en `localStorage` y
 * las no leídas son las posteriores a ella.
 *
 * @returns `vistoHasta` (fecha ISO o `null`) y `marcarVistas` para guardar ahora
 */
export function useNotificacionesVistas(userId: string) {
  const [estado, setEstado] = useState(() => ({
    userId,
    vistoHasta: leerVistoHasta(userId),
  }));

  // Si cambia el usuario se descarta lo del anterior
  const vistoHasta =
    estado.userId === userId ? estado.vistoHasta : leerVistoHasta(userId);

  const marcarVistas = () => {
    const ahora = new Date().toISOString();

    setEstado({ userId, vistoHasta: ahora });
    try {
      localStorage.setItem(getStorageKey(userId), ahora);
    } catch {
      // Sin almacenamiento solo se recuerda mientras la página siga abierta
    }
  };

  return { vistoHasta, marcarVistas };
}
