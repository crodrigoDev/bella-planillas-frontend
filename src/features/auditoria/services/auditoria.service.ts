import { isAxiosError } from "axios";

import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type {
  AuditoriaDetalle,
  AuditoriaFilters,
  AuditoriaLog,
  AuditoriaPage,
} from "../types/auditoria.types";

/**
 * Agrupa las consultas de auditoría que se comunican al backend
 */
export const auditoriaService = {
  /**
   * Consulta una página de la bitácora, de la más reciente a la más antigua
   *
   * @remarks
   * El backend no filtra por fechas ni por texto.
   */
  list: async (filters: AuditoriaFilters): Promise<AuditoriaPage> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<AuditoriaLog>
    >("/core/audit/logs", { params: filters });

    const { total, page, limit, totalPages } = response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
    };
  },

  /**
   * Busca una fila de la bitácora con sus valores antes y después
   *
   * @returns La fila, o null si no existe
   */
  getById: async (id: string): Promise<AuditoriaDetalle | null> => {
    try {
      const response = await protectedHttpClient.get<
        ApiResponse<AuditoriaDetalle>
      >(`/core/audit/logs/${id}`);

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;

      throw error;
    }
  },
};
