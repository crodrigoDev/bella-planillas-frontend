import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type { DashboardRrhhResponseDto } from "../types/dashboard.types";

/**
 * Consulta la información consolidada del dashboard de Recursos Humanos
 */
export const dashboardService = {
  /**
   * Obtiene el resumen de dotación, asistencia, contratos, cumpleaños y solicitudes del periodo
   *
   * @param periodo - Mes en formato YYYY-MM; si se omite, el servidor usa el mes en curso
   */
  getRrhh: async (periodo?: string): Promise<DashboardRrhhResponseDto> => {
    const response = await protectedHttpClient.get<
      ApiResponse<DashboardRrhhResponseDto>
    >("/rrhh/dashboard", {
      params: periodo ? { periodo } : undefined,
    });

    return response.data.data;
  },
};
