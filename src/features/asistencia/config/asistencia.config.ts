import type { SelectOption } from "@/lib/types/options.types";
import type { EstadoResumen, TipoMarca } from "../types/asistencia.types";

/** Nombre de cada estado del resumen mensual */
export const ESTADO_RESUMEN_LABELS: Record<EstadoResumen, string> = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

/** Colores de la insignia de cada estado del resumen */
export const ESTADO_RESUMEN_STYLES: Record<EstadoResumen, string> = {
  PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700",
  APROBADO: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RECHAZADO: "border-red-200 bg-red-50 text-red-700",
};

/** Nombre de cada estado de un día, por el código que envía el backend */
export const ESTADO_DIA_LABELS: Record<string, string> = {
  ASISTENCIA_REGISTRADA: "Asistió",
  MARCACION_INCOMPLETA: "Marcación incompleta",
  FALTA_INJUSTIFICADA: "Falta injustificada",
  AUSENCIA_SIN_GOCE: "Ausencia sin goce",
  AUSENCIA_PENDIENTE: "Ausencia por verificar",
  JUSTIFICADA: "Justificada",
  PENDIENTE: "Pendiente",
  NO_EVALUADO: "Sin evaluar",
  DESCANSO_SEMANAL: "Descanso semanal",
  FERIADO_O_DESCANSO_ACORDADO: "Feriado o descanso",
  FUERA_DE_VINCULO: "Fuera del vínculo",
};

/** Colores de la insignia de cada estado de un día */
export const ESTADO_DIA_STYLES: Record<string, string> = {
  ASISTENCIA_REGISTRADA: "border-emerald-200 bg-emerald-50 text-emerald-700",
  JUSTIFICADA: "border-sky-200 bg-sky-50 text-sky-700",
  FALTA_INJUSTIFICADA: "border-red-200 bg-red-50 text-red-700",
  MARCACION_INCOMPLETA: "border-amber-200 bg-amber-50 text-amber-700",
  AUSENCIA_SIN_GOCE: "border-amber-200 bg-amber-50 text-amber-700",
  AUSENCIA_PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700",
  PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700",
};

/** Estilo de un día sin color propio (descansos, fuera del vínculo...) */
export const ESTADO_DIA_NEUTRO = "border-border bg-muted text-muted-foreground";

/** Días en los que no hay nada que resolver porque no se trabaja o no hay vínculo */
export const ESTADOS_DIA_SIN_RESOLVER = [
  "FUERA_DE_VINCULO",
  "DESCANSO_SEMANAL",
  "FERIADO_O_DESCANSO_ACORDADO",
];

/** Texto de las alertas de un día, por el código que envía el backend */
export const ALERTA_LABELS: Record<string, string> = {
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
