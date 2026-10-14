import { CargaMasivaFilaSchema } from "@jyp/shared-contracts";
import type { EscenarioImportacion } from "../types/importar-empleados.types";

// Coincide con el limite de archivos configurado en Fastify
export const IMPORTACION_MAX_BYTES = 50 * 1024 * 1024;
export const IMPORTACION_COLUMNAS = Object.keys(CargaMasivaFilaSchema.shape);

export const IMPORTACION_ESCENARIOS = [
  { value: "correcto", label: "Importación sin errores" },
  { value: "validacion", label: "Archivo con errores de validación" },
  { value: "parcial", label: "Algunas filas fallan al procesar" },
  { value: "fallido", label: "Todas las filas fallan al procesar" },
  { value: "sin_validas", label: "Archivo sin filas válidas" },
] satisfies { value: EscenarioImportacion; label: string }[];

export const IMPORTACION_PASOS = [
  { title: "Preparar archivo", description: "Plantilla y carga" },
  { title: "Revisar y confirmar", description: "Validación de filas" },
  { title: "Resultado", description: "Seguimiento del trabajo" },
];
