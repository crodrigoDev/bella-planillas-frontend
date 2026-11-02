import type { EstadoContrato } from "../types/contratos.types";

/** Nombre de cada estado de contrato para mostrar */
export const ESTADO_CONTRATO_LABELS: Record<EstadoContrato, string> = {
  VIGENTE: "Vigente",
  RENOVADO: "Renovado",
  VENCIDO: "Vencido",
  ANULADO: "Anulado",
  FINALIZADO: "Finalizado",
};

/** Colores de la insignia de cada estado de contrato */
export const ESTADO_CONTRATO_STYLES: Record<EstadoContrato, string> = {
  VIGENTE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RENOVADO: "border-sky-200 bg-sky-50 text-sky-700",
  VENCIDO: "border-red-200 bg-red-50 text-red-700",
  ANULADO: "border-border bg-muted text-muted-foreground",
  FINALIZADO: "border-border bg-muted text-muted-foreground",
};

/** Color del punto de cada contrato en la línea de tiempo */
export const ESTADO_CONTRATO_DOT: Record<EstadoContrato, string> = {
  VIGENTE: "bg-emerald-500",
  RENOVADO: "bg-sky-400",
  VENCIDO: "bg-red-500",
  ANULADO: "bg-muted-foreground/40",
  FINALIZADO: "bg-muted-foreground/40",
};

/** Color del aviso de vencimiento según qué tan cerca está el fin */
export const ALERTA_VENCIMIENTO_STYLES = {
  VENCIDO: "text-red-600",
  CRITICO: "text-red-600",
  PREVENTIVO: "text-amber-600",
  REGULAR: "text-muted-foreground",
} as const;

/** Modalidad que no lleva fecha de fin */
export const MODALIDAD_INDETERMINADA = "INDETERMINADO";

/** Tamaño máximo del PDF que acepta el backend (5 MB) */
export const PDF_MAX_BYTES = 5 * 1024 * 1024;
