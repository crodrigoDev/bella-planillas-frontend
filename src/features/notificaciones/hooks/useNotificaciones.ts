import { useQuery } from "@tanstack/react-query";

import { notificacionesService } from "../services/notificaciones.service";

/** Claves de caché de las notificaciones */
export const notificacionesKey = {
  all: ["notificaciones"] as const,
};

/**
 * Carga el historial de alertas del rol
 *
 * @remarks
 * Es la carga inicial y el respaldo si el tiempo real no conecta; los eventos
 * del socket actualizan esta misma caché (`useNotificacionesSocket`).
 */
export function useNotificaciones(enabled = true) {
  return useQuery({
    queryKey: notificacionesKey.all,
    queryFn: notificacionesService.list,
    enabled,
    staleTime: 5 * 60_000,
  });
}
