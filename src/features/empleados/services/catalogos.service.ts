import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import { CATALOGO_LIMIT, toOptions } from "@/lib/catalogos.utils";
import type { SelectOption } from "@/lib/types/options.types";
import type { Empleado, EmpleadoRelacion } from "../types/empleados.types";

interface TipoDocumentoCatalogo {
  id: string;
  tipo_documento: string;
}

/**
 * Obtiene las listas de opciones que usan el listado y el registro de empleados
 */
export const catalogosService = {
  /** Consulta las áreas activas */
  listAreas: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoRelacion>
    >("/rrhh/area", { params: { limit: CATALOGO_LIMIT, activo: true } });

    return toOptions(response.data.data);
  },

  /**
   * Consulta los cargos activos
   *
   * @param areaId - Si se indica, solo los cargos de esa área
   */
  listCargos: async (areaId?: string): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoRelacion>
    >("/rrhh/cargo", {
      params: { limit: CATALOGO_LIMIT, activo: true, id_area: areaId },
    });

    return toOptions(response.data.data);
  },

  /** Consulta las jornadas activas */
  listJornadas: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoRelacion>
    >("/rrhh/jornadas", {
      params: { limit: CATALOGO_LIMIT, activo: true },
    });

    return toOptions(response.data.data);
  },

  /**
   * Consulta los empleados activos (hasta 100) con su nombre completo y su documento
   *
   * @param search - Si se indica, filtra por nombre o documento
   */
  listEmpleados: async (
    search?: string,
  ): Promise<(SelectOption & { nro_documento: string })[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<
        Pick<Empleado, "id" | "nombre_completo" | "nro_documento">
      >
    >("/rrhh/empleado", {
      params: {
        limit: CATALOGO_LIMIT,
        activo: true,
        search: search || undefined,
      },
    });

    return response.data.data.map(({ id, nombre_completo, nro_documento }) => ({
      value: id,
      label: nombre_completo,
      nro_documento,
    }));
  },

  /** Consulta los tipos de documento (DNI, CE, pasaporte...) */
  listTiposDocumento: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<TipoDocumentoCatalogo[]>
    >("/core/catalogos/tipos-documento");

    return response.data.data.map(({ id, tipo_documento }) => ({
      value: id,
      label: tipo_documento,
    }));
  },
};
