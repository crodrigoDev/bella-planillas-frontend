import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import { CATALOGO_LIMIT, toOptions } from "@/lib/catalogos.utils";
import type { SelectOption } from "@/lib/types/options.types";
import type { RegimenPension } from "../types/datosFinancieros.types";

/**
 * Listas de opciones de los datos financieros
 */
export const datosFinancierosCatalogosService = {
  /** Consulta las administradoras de AFP */
  listAfps: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<RegimenPension>
    >("/nomina/afp/tipos", { params: { limit: CATALOGO_LIMIT } });

    return toOptions(response.data.data);
  },

  /** Consulta los bancos disponibles para las cuentas de sueldo y CTS */
  listBancos: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<RegimenPension[]>
    >("/nomina/bancos");

    return toOptions(response.data.data);
  },

  /** Consulta los regímenes de pensión (ONP y SPP) */
  listRegimenesPension: async (): Promise<RegimenPension[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<RegimenPension[]>
    >("/core/catalogos/regimenes-pensionarios");

    return response.data.data;
  },
};
