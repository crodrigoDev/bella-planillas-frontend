import type { StatusTone } from "@/components/feedback/statusTone.config";
import { getOptionLabel } from "@/lib/catalogos.utils";
import type { SelectOption } from "@/lib/types/options.types";
import type {
  EstadoContrato,
  EstadoContratoFiltro,
  PorVencerDias,
} from "../types/contratos.types";

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

/** Estados por los que se puede filtrar (todos menos Anulado) */
export const ESTADOS_FILTRO: readonly EstadoContratoFiltro[] = [
  "VIGENTE",
  "VENCIDO",
  "RENOVADO",
  "FINALIZADO",
];

/**
 * Estados que ofrece el filtro del listado global
 *
 * @remarks
 * Sin Anulado: el backend nunca devuelve los contratos anulados.
 */
export const ESTADO_FILTRO_OPTIONS: SelectOption[] = ESTADOS_FILTRO.map(
  (estado) => ({ value: estado, label: ESTADO_CONTRATO[estado].label }),
);

/** Plazos, en días, del filtro "Por vencer" */
export const POR_VENCER_DIAS: readonly PorVencerDias[] = [15, 30, 60];

/** Opciones del filtro "Por vencer"; el valor es el número de días que se envía */
export const POR_VENCER_OPTIONS: SelectOption[] = POR_VENCER_DIAS.map(
  (dias) => ({ value: String(dias), label: `En ${dias} días` }),
);

/** Tono del aviso de vencimiento según qué tan cerca está el fin */
export const ALERTA_VENCIMIENTO_TONE = {
  VENCIDO: "danger",
  CRITICO: "danger",
  PREVENTIVO: "warning",
  REGULAR: "neutral",
} as const satisfies Record<string, StatusTone>;

/**
 * Modalidades que no llevan fecha de fin
 *
 * @remarks
 * Incluye `INDETERMINADO` para conservar el comportamiento de contratos
 * guardados antes del catálogo oficial.
 */
export const MODALIDADES_SIN_FECHA_FIN: readonly string[] = [
  "INDEFINIDO",
  "INDETERMINADO",
];

/** Indica si una modalidad de contrato prescinde de fecha de fin */
export const esModalidadSinFechaFin = (
  modalidad: string | null | undefined,
): boolean => Boolean(modalidad && MODALIDADES_SIN_FECHA_FIN.includes(modalidad));

/**
 * Convierte modalidades guardadas con códigos anteriores (como `INDETERMINADO`)
 * al código equivalente del catálogo actual
 */
export const normalizarModalidad = (
  codigo: string | null | undefined,
): string | undefined => {
  if (!codigo) return undefined;

  return codigo === "INDETERMINADO" ? "INDEFINIDO" : codigo;
};

const MODALIDAD_LEGACY_LABELS: Record<string, string> = {
  INDETERMINADO: "Indefinido",
};

/**
 * Devuelve la etiqueta legible de una modalidad, mostrando "Indefinido" para
 * contratos guardados con el código anterior `INDETERMINADO`
 */
export const getModalidadLabel = (
  modalidades: SelectOption[] | undefined,
  codigo: string | null | undefined,
): string => {
  if (!codigo) return "--";

  return MODALIDAD_LEGACY_LABELS[codigo] ?? getOptionLabel(modalidades, codigo);
};

/** Tamaño máximo del PDF que acepta el backend (5 MB) */
export const PDF_MAX_BYTES = 5 * 1024 * 1024;
