import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { PaginationApiResponse } from "@/lib/api/types/api.types";
import { CATALOGO_LIMIT } from "@/lib/catalogos.utils";
import type { ColaboradorOption } from "@/lib/types/options.types";
import type { EmpleadoOpcion } from "../types/planillas.types";

/** Fila mínima que devuelve `/rrhh/empleado` */
interface EmpleadoListadoCrudo {
  id: string;
  nombre_completo: string;
  nro_documento: string;
}

/**
 * Obtiene opciones de colaboradores para selectores y resolución de observaciones
 */
export const planillasCatalogosService = {
  /**
   * Consulta los colaboradores activos (hasta 100) para elegir uno al generar
   */
  listEmpleadosActivos: async (
    search?: string,
  ): Promise<ColaboradorOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoListadoCrudo>
    >("/rrhh/empleado", {
      params: {
        limit: CATALOGO_LIMIT,
        activo: true,
        search: search?.trim() || undefined,
      },
    });

    return response.data.data.map(
      ({ id, nombre_completo, nro_documento }) => ({
        value: id,
        label: nombre_completo,
        nro_documento,
      }),
    );
  },

  /**
   * Consulta hasta 100 colaboradores sin filtrar por estado activo para poner nombre a las observaciones
   */
  listEmpleados: async (): Promise<EmpleadoOpcion[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoListadoCrudo>
    >("/rrhh/empleado", {
      params: { limit: CATALOGO_LIMIT },
    });

    return response.data.data.map(
      ({ id, nombre_completo, nro_documento }) => ({
        id,
        nombreCompleto: nombre_completo,
        documento: nro_documento,
      }),
    );
  },
};
