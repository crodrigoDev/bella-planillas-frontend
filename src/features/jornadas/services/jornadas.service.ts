import type {
  ActualizarJornadaDto,
  CrearJornadaDto,
} from "@jyp/shared-contracts";
import { isAxiosError } from "axios";

import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type {
  Jornada,
  JornadaDetalle,
  JornadaFilters,
  JornadasPage,
} from "../types/jornadas.types";

/**
 * Agrupa las operaciones de jornadas que se comunican al backend
 */
export const jornadasService = {
  /**
   * Consulta una página de jornadas aplicando los filtros indicados
   *
   * @remarks
   * Solo trae jornadas que no se dieron de baja: al desactivar una, el backend
   * la saca del listado para siempre.
   */
  list: async (filters: JornadaFilters): Promise<JornadasPage> => {
    const { search, ...rest } = filters;

    const response = await protectedHttpClient.get<
      PaginationApiResponse<Jornada>
    >("/rrhh/jornadas", { params: { ...rest, search: search || undefined } });

    const { total, page, limit, totalPages } = response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
    };
  },

  /**
   * Busca una jornada por su id con su horario y sus áreas
   *
   * @returns La jornada, o null si no existe o fue desactivada
   */
  getById: async (id: string): Promise<JornadaDetalle | null> => {
    try {
      const response = await protectedHttpClient.get<
        ApiResponse<JornadaDetalle>
      >(`/rrhh/jornadas/${id}`);

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;

      throw error;
    }
  },

  /**
   * Crea una jornada
   *
   * @throws Un 400 si el nombre ya existe o el horario incumple los límites, y un 404 si un área no está activa
   */
  crear: async (dto: CrearJornadaDto): Promise<void> => {
    await protectedHttpClient.post("/rrhh/jornadas", dto);
  },

  /**
   * Actualiza una jornada (PUT; los campos que no se envían quedan igual)
   */
  editar: async (id: string, dto: ActualizarJornadaDto): Promise<void> => {
    await protectedHttpClient.put(`/rrhh/jornadas/${id}`, dto);
  },

  /**
   * Desactiva una jornada (DELETE `:id/desactivar`)
   *
   * @remarks
   * Es definitivo desde la app: el backend la da de baja (`deleted_at`) y ya
   * no aparece en ninguna consulta. Existe un endpoint de reactivar, pero no
   * puede usarse porque no hay forma de listar jornadas dadas de baja.
   * @throws Un 400 si tiene empleados activos asignados
   */
  desactivar: async (id: string): Promise<void> => {
    await protectedHttpClient.delete(`/rrhh/jornadas/${id}/desactivar`);
  },
};
