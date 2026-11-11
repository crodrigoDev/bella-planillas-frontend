import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { PaginationApiResponse } from "@/lib/api/types/api.types";
import type {
  EventoHistorial,
  HistorialPage,
} from "../types/historial.types";

/** Hechos por página; el backend admite hasta 100 */
export const HISTORIAL_LIMIT = 20;

/**
 * Agrupa las consultas del historial de un registro que se comunican al backend
 */
export const historialService = {
  /**
   * Consulta una página del historial de un registro, del más reciente al más antiguo
   *
   * @param tabla - Tabla del registro, por ejemplo `empleados`
   * @param registroId - Id del registro (UUID)
   * @param page - Número de página, desde 1
   */
  list: async (
    tabla: string,
    registroId: string,
    page: number,
  ): Promise<HistorialPage> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EventoHistorial>
    >(`/core/audit/historial/${tabla}/${registroId}`, {
      params: { page, limit: HISTORIAL_LIMIT },
    });

    const { total, limit, totalPages } = response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page: response.data.meta.page, limit, totalPages },
    };
  },
};
