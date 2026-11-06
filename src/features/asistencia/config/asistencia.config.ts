import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { SelectOption } from "@/lib/types/options.types";
import type { EstadoResumen, TipoMarca } from "../types/asistencia.types";

/** Nombre y tono de cada estado del resumen mensual */
export const ESTADO_RESUMEN: Record<
  EstadoResumen,
  { label: string; tone: StatusTone }
> = {
  PENDIENTE: { label: "Pendiente", tone: "warning" },
  APROBADO: { label: "Aprobado", tone: "success" },
  RECHAZADO: { label: "Rechazado", tone: "danger" },
};

/**
 * Nombre y tono de cada estado de un día, por el código que envía el backend
 *
 * @remarks
 * Los días sin color propio (descansos, fuera del vínculo...) son neutros.
 */
export const ESTADO_DIA: Record<string, { label: string; tone: StatusTone }> = {
  ASISTENCIA_REGISTRADA: { label: "Asistió", tone: "success" },
  MARCACION_INCOMPLETA: { label: "Marcación incompleta", tone: "warning" },
  FALTA_INJUSTIFICADA: { label: "Falta injustificada", tone: "danger" },
  AUSENCIA_SIN_GOCE: { label: "Ausencia sin goce", tone: "warning" },
  AUSENCIA_PENDIENTE: { label: "Ausencia por verificar", tone: "warning" },
  JUSTIFICADA: { label: "Justificada", tone: "info" },
  PENDIENTE: { label: "Pendiente", tone: "warning" },
  NO_EVALUADO: { label: "Sin evaluar", tone: "neutral" },
  DESCANSO_SEMANAL: { label: "Descanso semanal", tone: "neutral" },
  FERIADO_O_DESCANSO_ACORDADO: { label: "Feriado o descanso", tone: "neutral" },
  FUERA_DE_VINCULO: { label: "Fuera del vínculo", tone: "neutral" },
};

/** Estados de un día que hay que revisar o corregir */
export const ESTADOS_DIA_CON_PROBLEMA = [
  "FALTA_INJUSTIFICADA",
  "MARCACION_INCOMPLETA",
  "AUSENCIA_PENDIENTE",
  "AUSENCIA_SIN_GOCE",
  "PENDIENTE",
];

/** Días en los que no hay nada que resolver porque no se trabaja o no hay vínculo */
export const ESTADOS_DIA_SIN_RESOLVER = [
  "FUERA_DE_VINCULO",
  "DESCANSO_SEMANAL",
  "FERIADO_O_DESCANSO_ACORDADO",
];

/** Alerta del backend cuando el empleado no tiene jornada para ese día: el día no se calcula */
export const ALERTA_SIN_JORNADA = "JORNADA_HISTORICA_NO_ASIGNADA";

/** Texto de las alertas de un día, por el código que envía el backend */
export const ALERTA_LABELS: Record<string, string> = {
  [ALERTA_SIN_JORNADA]: "Sin jornada asignada",
  AUSENCIA_REQUIERE_VERIFICACION: "La ausencia necesita verificación",
  SOLICITUD_DE_ASISTENCIA_SIN_FECHAS: "Una solicitud no tiene fechas",
  INCAPACIDAD_MEDICA_REQUIERE_REVISION_DE_SUBSIDIOS:
    "La incapacidad médica requiere revisar subsidios",
  JORNADA_NO_SOPORTADA_POR_EL_ALCANCE_DE_40_O_48_HORAS:
    "La jornada no está soportada (solo de 40 o 48 horas)",
};

/** Tipos de marcación, con los valores que acepta el contrato */
export const TIPO_MARCA_OPTIONS: SelectOption[] = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "SALIDA_ALMUERZO", label: "Salida a almorzar" },
  { value: "ENTRADA_ALMUERZO", label: "Regreso de almorzar" },
  { value: "SALIDA", label: "Salida" },
];

/** Nombre de cada tipo de marcación */
export const TIPO_MARCA_LABELS = Object.fromEntries(
  TIPO_MARCA_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<TipoMarca, string>;

/** Qué se resuelve de un día */
export const TIPO_DECISION_OPTIONS: SelectOption[] = [
  { value: "AUSENCIA", label: "Ausencia del día" },
  { value: "MARCACIONES", label: "Corregir marcaciones" },
  { value: "SOBRETIEMPO", label: "Sobretiempo" },
];

/** Cómo se resuelve una ausencia, con los valores que acepta el contrato */
export const RESULTADO_AUSENCIA_OPTIONS: SelectOption[] = [
  { value: "FALTA_INJUSTIFICADA", label: "Falta injustificada" },
  { value: "CON_GOCE", label: "Ausencia con goce de haber" },
  { value: "SIN_GOCE", label: "Ausencia sin goce de haber" },
  { value: "INTERRUPCION_TECNICA", label: "Interrupción técnica" },
];

/** Si se reconoce o no el sobretiempo de un día */
export const RECONOCER_SOBRETIEMPO_OPTIONS: SelectOption[] = [
  { value: "SI", label: "Reconocer el sobretiempo" },
  { value: "NO", label: "No reconocer el sobretiempo" },
];

/** Cómo cuenta la tardanza cuando supera la tolerancia de la jornada */
export const POLITICA_TOLERANCIA_OPTIONS: SelectOption[] = [
  { value: "COMPLETA", label: "Contar toda la tardanza" },
  { value: "EXCESO", label: "Contar solo lo que pasa de la tolerancia" },
];

/** Zona horaria fija de Lima (sin horario de verano) para las marcaciones manuales */
export const ZONA_LIMA = "-05:00";
