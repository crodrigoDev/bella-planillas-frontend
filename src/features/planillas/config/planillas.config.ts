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

/** Conceptos que componen los ingresos de la planilla */
export const CONCEPTOS_INGRESO: readonly ConceptoPlanilla[] = [
  { campo: "sueldo_base", label: "Sueldo básico" },
  { campo: "asignacion_familia", label: "Asignación familiar" },
  { campo: "horas_extras_25", label: "Horas extras 25 %" },
  { campo: "horas_extras_35", label: "Horas extras 35 %" },
  { campo: "recargo_nocturno", label: "Recargo nocturno" },
  { campo: "gratificacion", label: "Gratificación" },
  {
    campo: "bonif_extraordinaria",
    label: "Bonificación extraordinaria Ley 30334",
  },
  { campo: "bono_extraordinario", label: "Bono extraordinario" },
];

/** Conceptos que componen los descuentos de la planilla */
export const CONCEPTOS_DESCUENTO: readonly ConceptoPlanilla[] = [
  { campo: "descuento_faltas", label: "Faltas" },
  { campo: "descuento_tardanzas", label: "Tardanzas" },
  { campo: "descuento_sin_goce", label: "Licencia sin goce" },
  { campo: "descuento_onp", label: "ONP" },
  { campo: "descuento_afp_fondo", label: "AFP fondo" },
  { campo: "descuento_afp_seguro", label: "AFP prima de seguro" },
  { campo: "descuento_afp_comision", label: "AFP comisión" },
  { campo: "descuento_quinta", label: "Renta de quinta categoría" },
  { campo: "descuento_adelanto", label: "Adelanto" },
  { campo: "descuento_eps", label: "EPS" },
  { campo: "descuento_autorizado", label: "Descuento autorizado" },
  { campo: "descuento_dso", label: "Descuento por descanso semanal" },
];

/** Conceptos que componen los aportes del empleador */
export const CONCEPTOS_APORTE: readonly ConceptoPlanilla[] = [
  { campo: "aporte_essalud", label: "EsSalud" },
  { campo: "aporte_vida_ley", label: "Vida Ley" },
];

/** Cantidades de filas por página admitidas en el listado de planillas */
export const PLANILLAS_LIMIT_OPTIONS = PAGE_SIZE_OPTIONS;
