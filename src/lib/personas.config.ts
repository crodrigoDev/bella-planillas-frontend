import type { SelectOption } from "@/lib/types/options.types";

/**
 * Opciones de sexo de una persona, con los valores que acepta el contrato
 */
export const SEXO_OPTIONS: SelectOption[] = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
];

/**
 * Opciones de estado civil de una persona, con los valores que acepta el contrato
 */
export const ESTADO_CIVIL_OPTIONS: SelectOption[] = [
  { value: "SOLTERO", label: "Soltero(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "CONVIVIENTE", label: "Conviviente" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUDO", label: "Viudo(a)" },
];
