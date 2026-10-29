import type { DerechohabienteDetalleDto } from "@jyp/shared-contracts";
import { isAxiosError } from "axios";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type {
  EmpleadoContrato,
  EmpleadoDatosFinancieros,
} from "../types/empleados.types";

/**
 * Consultas de las pestañas de la ficha del empleado
 */
export const empleadoDetalleService = {
  /**
   * Lista los contratos de un empleado, del más reciente al más antiguo
   *
   * @remarks
   * Pide hasta 100: un empleado no llega a tener tantos contratos.
   */
  listContratos: async (empleadoId: string): Promise<EmpleadoContrato[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoContrato>
    >(`/rrhh/contrato/empleado/${empleadoId}`, { params: { limit: 100 } });

    return response.data.data;
  },

  /** Lista los derechohabientes activos de un empleado */
  listDerechohabientes: async (
    empleadoId: string,
  ): Promise<DerechohabienteDetalleDto[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<DerechohabienteDetalleDto[]>
    >(`/rrhh/derechohabientes/empleado/${empleadoId}`);

    return response.data.data;
  },

  /**
   * Obtiene los datos financieros de un empleado
   *
   * @returns Los datos, o null si todavía no tiene (el backend responde 404)
   */
  getDatosFinancieros: async (
    empleadoId: string,
  ): Promise<EmpleadoDatosFinancieros | null> => {
    try {
      const response = await protectedHttpClient.get<
        ApiResponse<EmpleadoDatosFinancieros>
      >(`/payroll/dato-financiero/empleado/${empleadoId}`);

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;

      throw error;
    }
  },
};
