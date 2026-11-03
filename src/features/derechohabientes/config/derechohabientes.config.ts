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

/**
 * Tipos de documento de sustento, con los valores que acepta el contrato
 */
export const TIPO_SUSTENTO_OPTIONS: SelectOption[] = [
  { value: "PARTIDA_NACIMIENTO", label: "Partida de nacimiento" },
  { value: "PARTIDA_MATRIMONIO", label: "Partida de matrimonio" },
  { value: "ESCRITURA_CONCUBINATO", label: "Escritura de concubinato" },
  { value: "DNI_DERECHOHABIENTE", label: "DNI del derechohabiente" },
  { value: "CONSTANCIA_ESTUDIOS", label: "Constancia de estudios" },
  { value: "CERTIFICADO_INCAPACIDAD", label: "Certificado de incapacidad" },
  { value: "OTRO", label: "Otro" },
];

/** Tamaño máximo del sustento que acepta el backend (5 MB) */
export const SUSTENTO_MAX_BYTES = 5 * 1024 * 1024;

/** Tipos de archivo que se aceptan como sustento: PDF o Word */
export const SUSTENTO_TIPOS_ARCHIVO = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
