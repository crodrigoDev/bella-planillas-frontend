import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import { CATALOGO_LIMIT, toOptions } from "@/lib/catalogos.utils";
import type { SelectOption } from "@/lib/types/options.types";
import {
  MODALIDADES_CONTRATO_MOCK,
  REGIMENES_PENSION_MOCK,
  TIPOS_DOCUMENTO_MOCK,
} from "../data/catalogos.mock";
import type {
  EmpleadoRelacion,
  RegimenPension,
} from "../types/empleados.types";

/**
 * Obtiene las listas de opciones que usan el listado y el registro de empleados
 *
 * @remarks
 * Los métodos marcados como TEMPORAL devuelven datos fijos de
 * `catalogos.mock.ts` porque el backend todavía no expone ese catálogo.
 * Cuando exista el endpoint, solo hay que reemplazar el cuerpo del método.
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

  /** Consulta las administradoras de AFP */
  listAfps: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<EmpleadoRelacion>
    >("/payroll/afp/tipos", { params: { limit: CATALOGO_LIMIT } });

    return toOptions(response.data.data);
  },

  /** Consulta los bancos disponibles para las cuentas de sueldo y CTS */
  listBancos: async (): Promise<SelectOption[]> => {
    const response =
      await protectedHttpClient.get<ApiResponse<EmpleadoRelacion[]>>(
        "/payroll/bancos",
      );

    return toOptions(response.data.data);
  },

  /** TEMPORAL: tipos de documento (DNI, CE, pasaporte...) */
  listTiposDocumento: async (): Promise<SelectOption[]> => TIPOS_DOCUMENTO_MOCK,

  /** TEMPORAL: regímenes de pensión (ONP y SPP) */
  listRegimenesPension: async (): Promise<RegimenPension[]> =>
    REGIMENES_PENSION_MOCK,

  /**
   * TEMPORAL: modalidades de contrato (plazo fijo, indeterminado)
   *
   * @remarks
   * El backend no define una lista: solo guarda el texto de la modalidad.
   */
  listModalidadesContrato: async (): Promise<SelectOption[]> =>
    MODALIDADES_CONTRATO_MOCK,
};
