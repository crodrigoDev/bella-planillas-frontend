import type { SelectOption } from "@/lib/types/options.types";
import { MODALIDADES_CONTRATO_MOCK } from "../data/catalogos.mock";

/**
 * Listas de opciones de los contratos
 *
 * @remarks
 * Los métodos marcados como TEMPORAL devuelven datos fijos de
 * `catalogos.mock.ts` porque el backend todavía no expone ese catálogo.
 */
export const contratosCatalogosService = {
  /**
   * TEMPORAL: modalidades de contrato (plazo fijo, indeterminado)
   *
   * @remarks
   * El backend no define una lista: solo guarda el texto de la modalidad.
   */
  listModalidades: async (): Promise<SelectOption[]> =>
    MODALIDADES_CONTRATO_MOCK,
};
