import type { CrearDatoFinancieroDto } from "@jyp/shared-contracts";
import { isAxiosError } from "axios";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type { DatosFinancieros } from "../types/datosFinancieros.types";

/**
 * Agrupa las operaciones de datos financieros que se comunican al backend
 */
export const datosFinancierosService = {
  /**
   * Obtiene los datos financieros de un empleado
   *
   * @returns Los datos, o null si todavía no tiene (el backend responde 404)
   */
  getByEmpleado: async (
    empleadoId: string,
  ): Promise<DatosFinancieros | null> => {
    try {
      const response = await protectedHttpClient.get<
        ApiResponse<DatosFinancieros>
      >(`/payroll/dato-financiero/empleado/${empleadoId}`);

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;

      throw error;
    }
  },

  /**
   * Crea los datos financieros de un empleado
   *
   * @remarks
   * La fecha de filiación a la AFP no se envía aquí: se guarda en el empleado.
   */
  crear: async (
    empleadoId: string,
    datos: Omit<CrearDatoFinancieroDto, "empleado_id">,
  ): Promise<void> => {
    await protectedHttpClient.post("/payroll/dato-financiero", {
      ...datos,
      empleado_id: empleadoId,
    });
  },
};
