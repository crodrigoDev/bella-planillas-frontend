import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type { FilterOption } from "@/lib/types/filters.types";
import { REGIMENES_PENSION_MOCK } from "../data/catalogos.mock";
import type { RegimenPension } from "../types/nuevoEmpleado.types";

interface Banco {
  id: string;
  nombre: string;
}

interface TipoAfp {
  id: string;
  nombre: string;
  id_regimen: string;
}

// Máximo que permite el backend por página
const CATALOGO_LIMIT = 100;

/**
 * Obtiene las listas que alimentan el formulario de datos financieros
 */
export const datosFinancierosCatalogosService = {
  /**
   * Consulta los regímenes de pensión (ONP y SPP)
   *
   * @remarks
   * TEMPORAL: el backend todavía no expone este catálogo, así que devuelve
   * datos fijos (ver `catalogos.mock.ts`).
   */
  listRegimenesPension: async (): Promise<RegimenPension[]> =>
    REGIMENES_PENSION_MOCK,

  /** Consulta las administradoras de AFP */
  listAfps: async (): Promise<FilterOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<TipoAfp>
    >("/payroll/afp/tipos", { params: { limit: CATALOGO_LIMIT } });

    return response.data.data.map(({ id, nombre }) => ({
      value: id,
      label: nombre,
    }));
  },

  /** Consulta los bancos disponibles para las cuentas de sueldo y CTS */
  listBancos: async (): Promise<FilterOption[]> => {
    const response =
      await protectedHttpClient.get<ApiResponse<Banco[]>>("/payroll/bancos");

    return response.data.data.map(({ id, nombre }) => ({
      value: id,
      label: nombre,
    }));
  },
};
