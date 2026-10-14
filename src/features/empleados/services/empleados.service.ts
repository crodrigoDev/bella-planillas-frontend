import type { ListarEmpleadosQueryDto } from "@jyp/shared-contracts";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type { ListarEmpleadosResponse } from "../types/empleados.types";

/** Consulta real preparada para cuando dejemos de usar los mocks */
export const empleadosService = {
  listar: async (
    params: ListarEmpleadosQueryDto,
    signal?: AbortSignal,
  ): Promise<ListarEmpleadosResponse> => {
    const response = await protectedHttpClient.get<ListarEmpleadosResponse>(
      "/rrhh/empleado",
      { params, signal },
    );

    // Conserva data y meta para que la pagina reciba tambien la paginacion
    return response.data;
  },
};
