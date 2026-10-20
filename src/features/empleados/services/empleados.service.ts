import type { PaginationApiResponse } from "@/lib/api/types/api.types";
import type {
  Empleado,
  EmpleadoFilters,
  EmpleadosPage,
} from "../types/empleados.types";
import { protectedHttpClient } from "@/lib/api/protected-http-client";

/**
 * Agrupa las operaciones de empleados que se comunican al backend
 */
export const empleadosService = {
  /**
   * Consulta una página de empleados aplicando los filtros indicados
   *
   * @param filters - Página, busqueda y filtros del listado
   * @returns Los empleados de la página y los datos de paginación
   */
  list: async (filters: EmpleadoFilters): Promise<EmpleadosPage> => {
    const { search, ...rest } = filters;

    const response = await protectedHttpClient.get<
      PaginationApiResponse<Empleado>
    >("/rrhh/empleado", {
      params: { ...rest, search: search || undefined },
    });

    const { total, page, limit, totalPages } = response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
    };
  },
};
