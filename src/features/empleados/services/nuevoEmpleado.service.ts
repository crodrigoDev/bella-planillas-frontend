import type { CrearEmpleadoDto } from "@jyp/shared-contracts";
import type { ApiResponse } from "@/lib/api/types/api.types";
import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { EstadoLaboral } from "../types/empleados.types";

/** Respuesta al consultar si un número de documento ya está registrado */
export type DocumentoDisponibleResponse =
  | { disponible: true }
  | {
      disponible: false;
      empleado: {
        id: string;
        activo: boolean;
        estado_laboral: EstadoLaboral;
      };
    };

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

  /**
   * Verifica si existe un colaborador registrado con el número de documento dado
   *
   * @param nroDocumento - Número de documento a consultar
   */
  verificarDocumentoDisponible: async (
    nroDocumento: string,
  ): Promise<DocumentoDisponibleResponse> => {
    const response = await protectedHttpClient.get<
      ApiResponse<DocumentoDisponibleResponse>
    >(`/rrhh/empleado/dni/disponible/${encodeURIComponent(nroDocumento)}`);

    return response.data.data;
  },
};
