import type {
  ActualizarDatoFinancieroDto,
  CrearDatoFinancieroDto,
} from "@jyp/shared-contracts";
import { isAxiosError } from "axios";
import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type { DatosFinancieros } from "../types/datosFinancieros.types";

/**
 * Agrupa las operaciones de datos financieros que se comunican al backend
 *
 * @remarks
 * La ruta va como `RRHH` en mayúsculas: así está en el controlador del backend
 * y Fastify distingue mayúsculas (el `openapi.yml` dice `nomina`, está desactualizado).
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
      >(`/RRHH/dato-financiero/empleado/${empleadoId}`);

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
    await protectedHttpClient.post("/RRHH/dato-financiero", {
      ...datos,
      empleado_id: empleadoId,
    });
  },

  /**
   * Edita los datos financieros de un empleado
   *
   * @param dto - Campos a cambiar y la contraseña del usuario: el backend la
   * exige para cualquier cambio financiero
   *
   * @remarks
   * Un campo sin enviar queda como estaba. El backend no devuelve las cuentas
   * completas, así que solo se envía una cuenta o un CCI cuando se escribe uno nuevo.
   */
  editar: async (
    empleadoId: string,
    dto: ActualizarDatoFinancieroDto,
  ): Promise<void> => {
    await protectedHttpClient.put(
      `/RRHH/dato-financiero/empleado/${empleadoId}`,
      dto,
    );
  },
};
