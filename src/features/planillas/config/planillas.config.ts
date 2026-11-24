import { PAGE_SIZE_OPTIONS } from "@/components/data-table/dataTable.config";
import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { EstadoPlanilla, PlanillaDetalle } from "../types/planillas.types";

/** Etiqueta y tono agrupados por estado de planilla */
export const ESTADO_PLANILLA: Record<
  EstadoPlanilla,
  { label: string; tone: StatusTone }
> = {
  ABIERTO: { label: "Abierta", tone: "warning" },
  EN_REVISION: { label: "En revisión", tone: "info" },
  CONGELADO: { label: "Validada", tone: "success" },
  DECLARADO: { label: "Declarada", tone: "info" },
};

/** Concepto de planilla con el campo del detalle y su etiqueta legible */
export interface ConceptoPlanilla {
  campo: keyof PlanillaDetalle;
  label: string;
}

/** Conceptos que componen los ingresos de la planilla, en el orden de la boleta */
export const CONCEPTOS_INGRESO: readonly ConceptoPlanilla[] = [
  { campo: "sueldo_base", label: "Sueldo básico" },
  { campo: "asignacion_familia", label: "Asignación familiar" },
  { campo: "bono_extraordinario", label: "Bono extraordinario" },
  { campo: "horas_extras_25", label: "Horas extras 25 %" },
  { campo: "horas_extras_35", label: "Horas extras 35 %" },
  { campo: "recargo_nocturno", label: "Recargo nocturno" },
  { campo: "gratificacion", label: "Gratificación" },
  {
    campo: "bonif_extraordinaria",
    label: "Bonificación extraordinaria (Ley 30334)",
  },
];

/** Conceptos de descuento previsional para régimen ONP */
export const CONCEPTOS_ONP: readonly ConceptoPlanilla[] = [
  { campo: "descuento_onp", label: "ONP" },
];

/** Conceptos de descuento previsional para régimen AFP */
export const CONCEPTOS_AFP: readonly ConceptoPlanilla[] = [
  { campo: "descuento_afp_fondo", label: "AFP fondo" },
  { campo: "descuento_afp_seguro", label: "AFP prima de seguro" },
  { campo: "descuento_afp_comision", label: "AFP comisión" },
];

const DESCUENTOS_PREVIOS: readonly ConceptoPlanilla[] = [
  { campo: "descuento_faltas", label: "Faltas" },
  { campo: "descuento_tardanzas", label: "Tardanzas" },
  { campo: "descuento_sin_goce", label: "Permisos sin goce" },
  { campo: "descuento_dso", label: "Descanso semanal" },
  { campo: "descuento_autorizado", label: "Descuento autorizado" },
];

const DESCUENTOS_POSTERIORES: readonly ConceptoPlanilla[] = [
  { campo: "descuento_quinta", label: "Renta de quinta categoría" },
  { campo: "descuento_adelanto", label: "Adelanto de sueldo" },
  { campo: "descuento_eps", label: "EPS" },
];

/**
 * Arma la lista ordenada de descuentos según el régimen pensionario, igual que la boleta,
 * incluyendo además cualquier concepto del otro régimen cuyo monto sea distinto de cero
 */
export const getConceptosDescuento = (
  planilla: PlanillaDetalle,
  esOnp: boolean,
): readonly ConceptoPlanilla[] => {
  const principal = esOnp ? CONCEPTOS_ONP : CONCEPTOS_AFP;
  const alternativo = (esOnp ? CONCEPTOS_AFP : CONCEPTOS_ONP).filter(
    (concepto) => Number(planilla[concepto.campo]) !== 0,
  );

  return [
    ...DESCUENTOS_PREVIOS,
    ...principal,
    ...alternativo,
    ...DESCUENTOS_POSTERIORES,
  ];
};

/** Conceptos que componen los aportes del empleador */
export const CONCEPTOS_APORTE: readonly ConceptoPlanilla[] = [
  { campo: "aporte_essalud", label: "EsSalud" },
  { campo: "aporte_vida_ley", label: "Vida Ley" },
];

/** Cantidades de filas por página admitidas en el listado de planillas */
export const PLANILLAS_LIMIT_OPTIONS = PAGE_SIZE_OPTIONS;
