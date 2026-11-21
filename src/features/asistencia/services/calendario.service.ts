import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type {
  CalendarioAsistenciaRespuesta,
  DiaAdicionalCalendarioDto,
} from "../types/calendario.types";

/**
 * Agrupa las operaciones del calendario de asistencia que se comunican al backend
 */
export const calendarioService = {
  /**
   * Obtiene los feriados y los días acordados de un año
   *
   * @remarks
   * Trae todo el año ordenado por fecha; el filtro por origen se hace en el cliente.
   */
  listar: async (anio: number): Promise<CalendarioAsistenciaRespuesta> => {
    const response = await protectedHttpClient.get<
      ApiResponse<CalendarioAsistenciaRespuesta>
    >("/asistencia/calendario", { params: { anio } });

    return response.data.data;
  },

  /**
   * Crea, edita o activa/desactiva un día acordado
   *
   * @remarks
   * Es un upsert por fecha y se aplica a todos los colaboradores. El backend
   * responde 409 si el mes de la fecha está cerrado.
   */
  guardar: async (dto: DiaAdicionalCalendarioDto): Promise<void> => {
    await protectedHttpClient.post("/asistencia/calendario", dto);
  },
};
