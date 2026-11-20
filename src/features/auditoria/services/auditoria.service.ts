import { isAxiosError } from "axios";

import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type { ColaboradorOption } from "@/lib/types/options.types";
import type {
  AfectadoParams,
  AuditoriaFilters,
  AuditoriaPage,
  DetalleActividad,
  FilaActividad,
  TipoAfectadoConId,
  UsuarioBusqueda,
} from "../types/auditoria.types";

/** Usuarios que trae cada búsqueda del filtro "Hecho por" */
const USUARIOS_LIMIT = 20;

/** Pasa la respuesta paginada del backend a la forma que usa el front */
const toPage = (
  response: PaginationApiResponse<FilaActividad>,
): AuditoriaPage => {
  const { total, page, limit, totalPages } = response.meta;

  return { items: response.data, pagination: { total, page, limit, totalPages } };
};

/**
 * Agrupa las consultas de auditoría que se comunican al backend
 */
export const auditoriaService = {
  /**
   * Consulta una página de la actividad, de la más reciente a la más antigua
   *
   * @remarks
   * Un rol que no puede ver el módulo pedido recibe 403. El backend responde 400
   * si `desde` es posterior a `hasta`.
   */
  list: async (filters: AuditoriaFilters): Promise<AuditoriaPage> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<FilaActividad>
    >("/core/audit/actividad", { params: filters });

    return toPage(response.data);
  },

  /**
   * Busca cuentas de usuario para el filtro "Hecho por"
   *
   * @param search - Nombre, correo o documento a buscar
   * @returns Los usuarios como opciones de un selector de colaborador
   *
   * @remarks
   * El listado trae también las cuentas desactivadas (no se envía `activo`),
   * porque una acción vieja pudo hacerla un usuario que ya no está activo. Cada
   * opción muestra el nombre del colaborador o su correo si no tiene uno, y el
   * documento o el rol como segunda línea.
   */
  listUsuarios: async (search?: string): Promise<ColaboradorOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<UsuarioBusqueda>
    >("/core/usuarios", {
      params: { limit: USUARIOS_LIMIT, search: search || undefined },
    });

    return response.data.data.map(({ id, email, rol, empleados }) => ({
      value: id,
      label: empleados ? `${empleados.nombre} ${empleados.apellido}` : email,
      nro_documento: empleados?.nro_documento ?? rol,
    }));
  },

  /**
   * Busca una fila de actividad con sus cambios
   *
   * @returns La fila, o null si no existe o el rol no puede verla
   */
  getById: async (id: string): Promise<DetalleActividad | null> => {
    try {
      const response = await protectedHttpClient.get<
        ApiResponse<DetalleActividad>
      >(`/core/audit/actividad/${id}`);

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;

      throw error;
    }
  },

  /**
   * Consulta la línea de tiempo de un afectado, del cambio más reciente al más antiguo
   *
   * @param tipo - Tipo de afectado (la empresa no tiene línea de tiempo)
   * @param id - Id del afectado (UUID)
   *
   * @remarks
   * Para un empleado junta todo lo suyo: ficha, contratos, familiares y sus
   * documentos, datos financieros, solicitudes y asistencia.
   */
  listAfectado: async (
    tipo: TipoAfectadoConId,
    id: string,
    params: AfectadoParams,
  ): Promise<AuditoriaPage> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<FilaActividad>
    >(`/core/audit/afectados/${tipo}/${id}`, { params });

    return toPage(response.data);
  },
};
