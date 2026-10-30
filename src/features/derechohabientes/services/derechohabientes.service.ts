import type {
  DerechohabienteDetalleDto,
  RegistrarDerechohabienteDto,
} from "@jyp/shared-contracts";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type { ApiResponse } from "@/lib/api/types/api.types";

/**
 * Agrupa las operaciones de derechohabientes que se comunican al backend
 */
export const derechohabientesService = {
  /** Lista los derechohabientes activos de un empleado */
  listByEmpleado: async (
    empleadoId: string,
  ): Promise<DerechohabienteDetalleDto[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<DerechohabienteDetalleDto[]>
    >(`/rrhh/derechohabientes/empleado/${empleadoId}`);

    return response.data.data;
  },

  /** Registra un derechohabiente de un empleado */
  registrar: async (
    empleadoId: string,
    derechohabiente: Omit<RegistrarDerechohabienteDto, "empleado_id">,
  ): Promise<void> => {
    const dto: RegistrarDerechohabienteDto = {
      ...derechohabiente,
      empleado_id: empleadoId,
    };

    await protectedHttpClient.post("/rrhh/derechohabientes/registrar", dto);
  },
};
