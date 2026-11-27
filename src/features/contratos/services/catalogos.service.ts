import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type { SelectOption } from "@/lib/types/options.types";

interface ModalidadContratoCatalogo {
  codigo: string;
  descripcion: string;
}

/**
 * Listas de opciones de los contratos
 */
export const contratosCatalogosService = {
  /** Consulta las modalidades de contrato */
  listModalidades: async (): Promise<SelectOption[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<ModalidadContratoCatalogo[]>
    >("/core/catalogos/modalidades-contrato");

    return response.data.data.map(({ codigo, descripcion }) => ({
      value: codigo,
      label: descripcion,
    }));
  },
};
