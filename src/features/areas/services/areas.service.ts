import type { ActualizarAreaDto, CrearAreaDto } from "@jyp/shared-contracts";

import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { PaginationApiResponse } from "@/lib/api/types/api.types";
import type {
  AreaFilters,
  AreaResumenDto,
  AreasPage,
} from "../types/areas.types";

/**
 * Agrupa las operaciones de áreas que se comunican al backend
 */
export const areasService = {
  /**
   * Consulta una página de áreas aplicando los filtros indicados
   *
   * @remarks
   * Solo trae áreas activas: al desactivar una, el backend la saca del
   * listado y no hay forma de consultar las desactivadas.
   */
  list: async (filters: AreaFilters): Promise<AreasPage> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<AreaResumenDto>
    >("/rrhh/area", { params: filters });

    const { total, page, limit, totalPages } = response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
    };
  },

  /**
   * Crea un área nueva
   *
   * @throws Un 400 si ya existe otra área con el mismo nombre
   */
  crear: async (dto: CrearAreaDto): Promise<void> => {
    await protectedHttpClient.post("/rrhh/area/crear", dto);
  },

  /**
   * Actualiza un área existente (los campos no enviados se conservan; `descripcion: null` la borra)
   *
   * @throws Un 400 si el nuevo nombre ya pertenece a otra área
   */
  editar: async (id: string, dto: ActualizarAreaDto): Promise<void> => {
    await protectedHttpClient.put(`/rrhh/area/${id}`, dto);
  },

  /**
   * Desactiva un área (`DELETE :id/desactivar`)
   *
   * @remarks
   * Es irreversible desde la app: el área desaparece del listado.
   * @throws Un 400 si tiene colaboradores activos o cargos activos
   */
  desactivar: async (id: string): Promise<void> => {
    await protectedHttpClient.delete(`/rrhh/area/${id}/desactivar`);
  },
};
