import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import { CATALOGO_LIMIT, toOptions } from "@/lib/catalogos.utils";
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

    return toOptions(response.data.data);
  },

  /** Consulta los bancos disponibles para las cuentas de sueldo y CTS */
  listBancos: async (): Promise<FilterOption[]> => {
    const response =
      await protectedHttpClient.get<ApiResponse<Banco[]>>("/payroll/bancos");

    return toOptions(response.data.data);
  },
};
