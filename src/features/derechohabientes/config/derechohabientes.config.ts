import type { SelectOption } from "@/lib/types/options.types";

/**
 * Vínculos del derechohabiente con el empleado, con los valores que acepta el contrato
 */
export const VINCULO_OPTIONS: SelectOption[] = [
  { value: "CONYUGE", label: "Cónyuge" },
  { value: "CONCUBINO", label: "Concubino(a)" },
  { value: "HIJO_MENOR", label: "Hijo menor de edad" },
  { value: "HIJO_MAYOR_INCAPACITADO", label: "Hijo mayor incapacitado" },
  { value: "HIJO_MAYOR_ESTUDIANTE", label: "Hijo mayor estudiante" },
  { value: "MADRE_GESTANTE", label: "Madre gestante" },
];
