import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { EstadoContrato } from "../types/contratos.types";

/**
 * Nombre y tono de cada estado de contrato
 *
 * @remarks
 * El tono da el color de la insignia y del punto de la línea de tiempo.
 */
export const ESTADO_CONTRATO: Record<
  EstadoContrato,
  { label: string; tone: StatusTone }
> = {
  VIGENTE: { label: "Vigente", tone: "success" },
  RENOVADO: { label: "Renovado", tone: "info" },
  VENCIDO: { label: "Vencido", tone: "danger" },
  ANULADO: { label: "Anulado", tone: "neutral" },
  FINALIZADO: { label: "Finalizado", tone: "neutral" },
};

/** Tono del aviso de vencimiento según qué tan cerca está el fin */
export const ALERTA_VENCIMIENTO_TONE = {
  VENCIDO: "danger",
  CRITICO: "danger",
  PREVENTIVO: "warning",
  REGULAR: "neutral",
} as const satisfies Record<string, StatusTone>;

/** Modalidad que no lleva fecha de fin */
export const MODALIDAD_INDETERMINADA = "INDETERMINADO";

/** Tamaño máximo del PDF que acepta el backend (5 MB) */
export const PDF_MAX_BYTES = 5 * 1024 * 1024;
