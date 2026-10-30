import type { CrearEmpleadoDto } from "@jyp/shared-contracts";
import type { ApiResponse } from "@/lib/api/types/api.types";
import { protectedHttpClient } from "@/lib/api/protected-http-client";

/**
 * Operaciones del backend con las que se registra un empleado nuevo
 *
 * @remarks
 * El registro no es una sola llamada: primero se crea el empleado y con su
 * id se crean después los datos financieros, el contrato y los derechohabientes.
 */
export const nuevoEmpleadoService = {
  /**
   * Crea el empleado
   *
   * @returns El id del empleado creado
   */
  crearEmpleado: async (dto: CrearEmpleadoDto): Promise<string> => {
    const response = await protectedHttpClient.post<ApiResponse<{ id: string }>>(
      "/rrhh/empleado",
      dto,
    );

    return response.data.data.id;
  },
};
