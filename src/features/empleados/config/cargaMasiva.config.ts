import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { StepperStep } from "@/components/stepper/Stepper";
import type { CargaMasivaEstado } from "../types/cargaMasiva.types";

/** Pasos de la importación masiva de empleados */
export const CARGA_MASIVA_STEPS: readonly StepperStep[] = [
  { id: "archivo", label: "Archivo" },
  { id: "revision", label: "Revisión" },
  { id: "resultado", label: "Resultado" },
];

/** Posición de cada paso en `CARGA_MASIVA_STEPS` */
export const PASO_ARCHIVO = 0;
export const PASO_REVISION = 1;
export const PASO_RESULTADO = 2;

/** Extensiones que acepta el backend, en el formato del `accept` del input */
export const CARGA_MASIVA_EXTENSIONES = ".xlsx,.csv";

/** Tamaño máximo del archivo */
export const CARGA_MASIVA_MAX_BYTES = 5 * 1024 * 1024;

/** Nombre y tono de cada estado del trabajo de importación */
export const ESTADO_CARGA_MASIVA: Record<
  CargaMasivaEstado,
  { label: string; tone: StatusTone }
> = {
  EN_COLA: { label: "En cola", tone: "neutral" },
  PROCESANDO: { label: "Procesando", tone: "info" },
  COMPLETADO: { label: "Completado", tone: "success" },
  FALLIDO: { label: "Fallido", tone: "danger" },
};
