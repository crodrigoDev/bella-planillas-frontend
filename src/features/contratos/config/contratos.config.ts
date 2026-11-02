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

/** Modalidad que no lleva fecha de fin */
export const MODALIDAD_INDETERMINADA = "INDETERMINADO";

/** Tamaño máximo del PDF que acepta el backend (5 MB) */
export const PDF_MAX_BYTES = 5 * 1024 * 1024;
