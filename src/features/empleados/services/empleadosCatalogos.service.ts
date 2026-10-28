import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type { PaginationApiResponse } from "@/lib/api/types/api.types";
import type { FilterOption } from "@/lib/types/filters.types";
import type { EmpleadoRelacion } from "@/features/empleados/types/empleados.types";

// Máximo que permite el backend por página
const CATALOGO_LIMIT = 100;

/**
 * Convierte los registros del backend en opciones para un Select
 */
const toOptions = (items: EmpleadoRelacion[]): FilterOption[] =>
  items.map(({ id, nombre }) => ({ value: id, label: nombre }));

/**
 * Obtiene las listas que alimentan los filtros del listado de empleados
 */
export const empleadosCatalogosService = {
  /**
   * Consulta el cátalogo de áreas activas
   *
   * @returns Cátalogo de áreas para un select
   */
  listAreas: async (): Promise<FilterOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoRelacion>
    >("/rrhh/area", { params: { limit: CATALOGO_LIMIT, activo: true } });

    return toOptions(response.data.data);
  },

  /**
   * Consulta el cátalogo de cargos activos según el área
   *
   * @param areaId - identificador del área
   * @returns Cátalogo de cargos activos
   */
  listCargos: async (areaId?: string): Promise<FilterOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoRelacion>
    >("/rrhh/cargo", {
      params: { limit: CATALOGO_LIMIT, activo: true, id_area: areaId },
    });

    return toOptions(response.data.data);
  },

  /**
   * Consulta el cátalogo de jornadas activas
   *
   * @returns Catálogo de jornadas activas
   */
  listJornadas: async (): Promise<FilterOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoRelacion>
    >("/rrhh/jornadas", {
      params: { limit: CATALOGO_LIMIT, activo: true },
    });

    return toOptions(response.data.data);
  },

  /**
   * Consulta los tipos de documento (DNI, CE, pasaporte...)
   *
   * @remarks
   * El backend todavía no expone este catálogo. Se asume `GET /rrhh/tipo-documento`
   * con registros `{ id, tipo_documento }`, que es como los guarda la base de datos.
   * Si la ruta final es otra, solo hay que cambiarla aquí.
   */
  listTiposDocumento: async (): Promise<FilterOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<{ id: string; tipo_documento: string }>
    >("/rrhh/tipo-documento", { params: { limit: CATALOGO_LIMIT } });

    return response.data.data.map(({ id, tipo_documento }) => ({
      value: id,
      label: tipo_documento,
    }));
  },
};
