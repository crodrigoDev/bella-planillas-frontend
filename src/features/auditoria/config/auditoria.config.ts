import type { StatusTone } from "@/components/feedback/statusTone.config";

/**
 * Tablas que audita el trigger de la base de datos
 *
 * @remarks
 * Es lo único que se audita hoy. El endpoint acepta cualquier texto, pero el
 * filtro solo ofrece estas.
 */
export const TABLA_OPTIONS: { value: string; label: string }[] = [
  { value: "asistencia_marcacion", label: "Marcaciones" },
  { value: "asistencia_decision", label: "Decisiones de asistencia" },
  { value: "asistencia_jornada", label: "Asignación de jornada" },
  { value: "asistencia_calendario", label: "Calendario" },
  { value: "incidencias_mes", label: "Resumen mensual de asistencia" },
  { value: "historial_planillas", label: "Planillas" },
  { value: "novedad_planilla", label: "Novedades de planilla" },
  { value: "adelanto_desembolso", label: "Desembolsos de adelanto" },
  { value: "solicitud", label: "Solicitudes" },
];

/** Acciones que escribe el trigger */
export const ACCION_OPTIONS: { value: string; label: string }[] = [
  { value: "CREATE", label: "Creación" },
  { value: "UPDATE", label: "Modificación" },
];

/** Tabla de las solicitudes, la única cuyo registro tiene una pantalla de detalle */
export const TABLA_SOLICITUD = "solicitud";

/** Color de la insignia de cada acción */
const ACCION_TONE: Record<string, StatusTone> = {
  CREATE: "success",
  UPDATE: "info",
};

/** Nombre legible de una tabla; una desconocida se muestra tal cual */
export const getTablaLabel = (tabla: string): string =>
  TABLA_OPTIONS.find((option) => option.value === tabla)?.label ?? tabla;

/** Nombre legible de una acción; una desconocida se muestra tal cual */
export const getAccionLabel = (accion: string): string =>
  ACCION_OPTIONS.find((option) => option.value === accion)?.label ?? accion;

/** Tono de la insignia de una acción; una desconocida es neutral */
export const getAccionTone = (accion: string): StatusTone =>
  ACCION_TONE[accion] ?? "neutral";

/**
 * Campos técnicos que se ocultan en "Ver cambios"
 *
 * @remarks
 * Cambian en cada modificación o no le dicen nada al usuario.
 */
export const CAMPOS_OCULTOS: readonly string[] = [
  "id",
  "created_at",
  "updated_at",
];
