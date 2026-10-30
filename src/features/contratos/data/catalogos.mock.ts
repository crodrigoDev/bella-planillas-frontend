import type { SelectOption } from "@/lib/types/options.types";

/** TEMPORAL: ver `catalogos.service.ts` de esta feature */
/** Modalidades de contrato; el valor es el texto que guarda el backend */
export const MODALIDADES_CONTRATO_MOCK: SelectOption[] = [
  { value: "PLAZO_FIJO", label: "Plazo fijo" },
  { value: "INDETERMINADO", label: "Indeterminado" },
];
