import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type { Notificacion } from "../types/notificaciones.types";

/**
 * Agrupa las consultas de notificaciones que se comunican al backend
 */
export const notificacionesService = {
  /**
   * Trae el historial de alertas del rol del usuario
   *
   * @remarks
   * Son hasta 50 de los últimos 90 días, la más reciente primero. El
   * interceptor del backend envuelve el arreglo en `{ data }`.
   */
  list: async (): Promise<Notificacion[]> => {
    const response =
      await protectedHttpClient.get<ApiResponse<Notificacion[]>>(
        "/notificaciones",
      );

    return response.data.data;
  },
};
