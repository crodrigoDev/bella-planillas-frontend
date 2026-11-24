import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { SelectOption } from "@/lib/types/options.types";
import type { EstadoNovedad, TipoNovedad } from "../types/novedades.types";

/** Etiquetas legibles para cada tipo de novedad */
export const TIPO_NOVEDAD_LABELS: Record<TipoNovedad, string> = {
  BONO_EXTRAORDINARIO_REMUNERATIVO: "Bono extraordinario",
  DESCUENTO_AUTORIZADO: "Descuento autorizado",
  DESCUENTO_DSO: "Descuento por descanso semanal",
};

/** Explicación del efecto de cada tipo de novedad para el contador */
export const TIPO_NOVEDAD_AYUDA: Record<TipoNovedad, string> = {
  BONO_EXTRAORDINARIO_REMUNERATIVO:
    "Se suma a los ingresos del colaborador como bono extraordinario y forma parte de la base para el cálculo de pensión.",
  DESCUENTO_AUTORIZADO:
    "Se resta del pago neto del colaborador en el mes.",
  DESCUENTO_DSO:
    "Se resta del ingreso y reduce la base para el cálculo de pensión. Es obligatorio cuando hubo faltas o permisos sin goce en el mes (puede ser 0) y solo puede haber uno aprobado por mes.",
};

/** Opciones del selector de tipo de novedad */
export const TIPO_NOVEDAD_OPTIONS: SelectOption[] = [
  {
    value: "BONO_EXTRAORDINARIO_REMUNERATIVO",
    label: TIPO_NOVEDAD_LABELS.BONO_EXTRAORDINARIO_REMUNERATIVO,
  },
  {
    value: "DESCUENTO_AUTORIZADO",
    label: TIPO_NOVEDAD_LABELS.DESCUENTO_AUTORIZADO,
  },
  {
    value: "DESCUENTO_DSO",
    label: TIPO_NOVEDAD_LABELS.DESCUENTO_DSO,
  },
];

/** Etiquetas legibles para cada estado de novedad */
export const ESTADO_NOVEDAD_LABELS: Record<EstadoNovedad, string> = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobada",
  RECHAZADO: "Rechazada",
  ANULADO: "Anulada",
};

/** Tono visual de la insignia para cada estado de novedad */
export const ESTADO_NOVEDAD_TONE: Record<EstadoNovedad, StatusTone> = {
  PENDIENTE: "warning",
  APROBADO: "success",
  RECHAZADO: "danger",
  ANULADO: "neutral",
};

/** Indica si el tipo de novedad resta del pago (descuento) o suma (ingreso) */
export const esDescuento = (tipo: TipoNovedad): boolean =>
  tipo !== "BONO_EXTRAORDINARIO_REMUNERATIVO";

/** Etiqueta de naturaleza del tipo de novedad para la tabla */
export const getNaturalezaNovedad = (tipo: TipoNovedad): string =>
  esDescuento(tipo) ? "Descuento" : "Ingreso";
