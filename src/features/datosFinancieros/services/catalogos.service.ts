import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import { CATALOGO_LIMIT, toOptions } from "@/lib/catalogos.utils";
import type { SelectOption } from "@/lib/types/options.types";
import { REGIMENES_PENSION_MOCK } from "../data/catalogos.mock";
import type { RegimenPension } from "../types/datosFinancieros.types";

/**
 * Listas de opciones de los datos financieros
 *
 * @remarks
 * Los métodos marcados como TEMPORAL devuelven datos fijos de
 * `catalogos.mock.ts` porque el backend todavía no expone ese catálogo.
 */
export const datosFinancierosCatalogosService = {
  /** Consulta las administradoras de AFP */
  listAfps: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<RegimenPension>
    >("/payroll/afp/tipos", { params: { limit: CATALOGO_LIMIT } });

    return toOptions(response.data.data);
  },

  /** Consulta los bancos disponibles para las cuentas de sueldo y CTS */
  listBancos: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<RegimenPension[]>
    >("/payroll/bancos");

    return toOptions(response.data.data);
  },

  /** TEMPORAL: regímenes de pensión (ONP y SPP) */
  listRegimenesPension: async (): Promise<RegimenPension[]> =>
    REGIMENES_PENSION_MOCK,
};
