import type { ActualizarCargoDto, CrearCargoDto } from "@jyp/shared-contracts";

import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { PaginationApiResponse } from "@/lib/api/types/api.types";
import type {
  CargoFilters,
  CargoResumenDto,
  CargosPage,
} from "../types/cargos.types";

/**
 * Agrupa las operaciones de cargos que se comunican al backend
 */
export const cargosService = {
  /**
   * Consulta una página de cargos aplicando los filtros indicados
   *
   * @remarks
   * Solo trae cargos activos: al desactivar uno, el backend lo saca del
   * listado y no hay forma de consultar los desactivados.
   */
  list: async (filters: CargoFilters): Promise<CargosPage> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<CargoResumenDto>
    >("/rrhh/cargo", { params: filters });

    const { total, page, limit, totalPages } = response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
    };
  },

  /**
   * Crea un cargo nuevo dentro de un área activa
   *
   * @throws Un 400 si ya existe otro cargo con el mismo nombre en esa área o la banda salarial es inconsistente
   */
  crear: async (dto: CrearCargoDto): Promise<void> => {
    await protectedHttpClient.post("/rrhh/cargo/crear", dto);
  },

  /**
   * Actualiza un cargo existente (los campos no enviados se conservan; `null` en descripción o sueldo máximo los borra)
   *
   * @throws Un 400 si el nombre ya pertenece a otro cargo de esa área o la banda salarial es inconsistente
   */
  editar: async (id: string, dto: ActualizarCargoDto): Promise<void> => {
    await protectedHttpClient.put(`/rrhh/cargo/${id}`, dto);
  },

  /**
   * Desactiva un cargo (`DELETE :id/desactive`)
   *
   * @remarks
   * Es irreversible desde la app: el cargo desaparece del listado.
   * @throws Un 400 si tiene colaboradores activos asignados
   */
  desactivar: async (id: string): Promise<void> => {
    await protectedHttpClient.delete(`/rrhh/cargo/${id}/desactive`);
  },
};
