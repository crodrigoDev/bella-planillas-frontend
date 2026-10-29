import type {
  CambiarEstadoLaboralDto,
  DesactivarEmpleadoDto,
} from "@jyp/shared-contracts";
import type { PaginationApiResponse } from "@/lib/api/types/api.types";
import type {
  Empleado,
  EmpleadoFilters,
  EmpleadosPage,
} from "../types/empleados.types";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import { CATALOGO_LIMIT } from "@/lib/catalogos.utils";

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

  /**
   * Busca un empleado por su id
   *
   * @returns El empleado, o null si no existe
   *
   * @remarks
   * TEMPORAL: el backend todavía no tiene `GET /rrhh/empleado/:id`. Recorre
   * el listado de 100 en 100 hasta encontrarlo. Cuando exista el endpoint,
   * se reemplaza el cuerpo por una sola llamada y nada más cambia.
   */
  getById: async (id: string): Promise<Empleado | null> => {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const result = await empleadosService.list({
        page,
        limit: CATALOGO_LIMIT,
      });
      const found = result.items.find((empleado) => empleado.id === id);

      if (found) return found;

      totalPages = result.pagination.totalPages;
      page += 1;
    }

    return null;
  },

  /**
   * Cambia el estado laboral de un empleado que sigue activo
   *
   * @param id - Identificador del empleado
   * @param dto - Nuevo estado y motivo opcional
   * @throws Si el empleado está inactivo o ya tiene ese estado
   */
  cambiarEstadoLaboral: async (
    id: string,
    dto: CambiarEstadoLaboralDto,
  ): Promise<void> => {
    await protectedHttpClient.patch(`/rrhh/empleado/${id}/estado-laboral`, dto);
  },

  /**
   * Da de baja a un empleado: queda inactivo y cesado
   *
   * @param id - Identificador del empleado
   * @param dto - Fecha de cese y motivo; si no se envían, se usa la fecha de hoy
   */
  desactivar: async (
    id: string,
    dto?: DesactivarEmpleadoDto,
  ): Promise<void> => {
    await protectedHttpClient.delete(`/rrhh/empleado/${id}/desactivar`, {
      data: dto,
    });
  },

  /**
   * Reactiva a un empleado dado de baja: vuelve a Activo y se quita su fecha de cese
   *
   * @param id - Identificador del empleado
   */
  reactivar: async (id: string): Promise<void> => {
    await protectedHttpClient.patch(`/rrhh/empleado/${id}/reactivar`);
  },
};
