import type { StatusTone } from "@/components/feedback/statusTone.config";

/**
 * Tablas que RRHH puede consultar en la auditoría
 *
 * @remarks
 * Es la lista `TABLAS_PERMITIDAS_RRHH` del backend: pedir otra tabla responde
 * 403. Los registros de asistencia y solicitudes los escribe un trigger de la
 * base de datos; el resto, la capa de acceso a datos del backend.
 */
export const TABLA_OPTIONS: { value: string; label: string }[] = [
  { value: "empleados", label: "Empleados" },
  { value: "contratos", label: "Contratos" },
  { value: "derechohabientes", label: "Derechohabientes" },
  {
    value: "derechohabiente_documentos",
    label: "Sustentos de derechohabientes",
  },
  { value: "dato_financiero", label: "Datos financieros" },
  { value: "area", label: "Áreas" },
  { value: "cargo", label: "Cargos" },
  { value: "jornada", label: "Jornadas" },
  { value: "jornada_area", label: "Jornadas por área" },
  { value: "solicitud", label: "Solicitudes" },
  { value: "asistencia_marcacion", label: "Marcaciones" },
  { value: "asistencia_decision", label: "Decisiones de asistencia" },
  { value: "asistencia_jornada", label: "Asignación de jornada" },
  { value: "asistencia_calendario", label: "Calendario" },
  { value: "incidencias_mes", label: "Resumen mensual de asistencia" },
];

/**
 * Acciones que se guardan en la bitácora
 *
 * @remarks
 * Los triggers solo escriben `CREATE` y `UPDATE`; la capa de acceso a datos del
 * backend usa el nombre de la operación, con sus variantes masivas.
 */
export const ACCION_OPTIONS: { value: string; label: string }[] = [
  { value: "CREATE", label: "Creación" },
  { value: "UPDATE", label: "Modificación" },
  { value: "DELETE", label: "Eliminación" },
  { value: "UPSERT", label: "Creación o modificación" },
  { value: "CREATEMANY", label: "Creación masiva" },
  { value: "UPDATEMANY", label: "Modificación masiva" },
  { value: "DELETEMANY", label: "Eliminación masiva" },
];

/** Tabla de las solicitudes, la única cuyo registro tiene una pantalla de detalle */
export const TABLA_SOLICITUD = "solicitud";

/** Color de la insignia de cada acción */
const ACCION_TONE: Record<string, StatusTone> = {
  CREATE: "success",
  CREATEMANY: "success",
  UPDATE: "info",
  UPSERT: "info",
  UPDATEMANY: "info",
  DELETE: "danger",
  DELETEMANY: "danger",
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
