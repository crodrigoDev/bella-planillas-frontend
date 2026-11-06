import type {
  CambiarEstadoLaboralDto,
  DesactivarEmpleadoDto,
  EditarEmpleadoDto,
} from "@jyp/shared-contracts";
import { isAxiosError } from "axios";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type {
  Empleado,
  EmpleadoFilters,
  EmpleadosPage,
} from "../types/empleados.types";
import { protectedHttpClient } from "@/lib/api/protectedHttpClient";

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
   * Busca un empleado por su id con todos sus datos (personales, domicilio y laborales)
   *
   * @returns El empleado, o null si no existe
   */
  getById: async (id: string): Promise<Empleado | null> => {
    try {
      const response = await protectedHttpClient.get<ApiResponse<Empleado>>(
        `/rrhh/empleado/${id}`,
      );

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;

      throw error;
    }
  },

  /**
   * Actualiza los datos del empleado (no toca contratos, derechohabientes ni datos financieros)
   *
   * @param id - Identificador del empleado
   * @param dto - Campos a cambiar; los que no se envían quedan igual
   */
  editar: async (id: string, dto: EditarEmpleadoDto): Promise<void> => {
    await protectedHttpClient.put(`/rrhh/empleado/${id}`, dto);
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
