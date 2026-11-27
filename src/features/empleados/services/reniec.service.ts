import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";

/** Nombres y apellidos devueltos por RENIEC para un DNI */
export interface DatosReniec {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

/**
 * Consulta los datos de identidad de una persona por su DNI
 */
export const reniecService = {
  /**
   * Obtiene nombres y apellidos desde RENIEC para un DNI de 8 dígitos
   *
   * @param dni - Número de DNI
   */
  consultarDni: async (dni: string): Promise<DatosReniec> => {
    const response = await protectedHttpClient.get<ApiResponse<DatosReniec>>(
      `/rrhh/empleado/dni/datos-reniec/${dni}`,
    );

    return response.data.data;
  },
};
