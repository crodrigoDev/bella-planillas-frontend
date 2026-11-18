import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { TipoAfectadoAuditoria } from "../types/auditoria.types";

/**
 * Módulos por los que se puede filtrar la actividad
 *
 * @remarks
 * Es la lista `TABLAS_PERMITIDAS_RRHH` del backend: pedir otra tabla responde
 * 403. El backend filtra por una sola tabla, y varias comparten el mismo módulo
 * (`modulo_etiqueta`): por eso esas opciones empiezan con el nombre del módulo
 * que se ve en la tabla ("Asistencia · Marcaciones").
 */
export const TABLA_OPTIONS: { value: string; label: string }[] = [
  { value: "empleados", label: "Empleados" },
  { value: "contratos", label: "Contratos" },
  { value: "derechohabientes", label: "Familiares" },
  { value: "derechohabiente_documentos", label: "Familiares · Documentos" },
  { value: "dato_financiero", label: "Datos financieros" },
  { value: "area", label: "Áreas" },
  { value: "cargo", label: "Cargos" },
  { value: "jornada", label: "Jornadas" },
  { value: "jornada_area", label: "Jornadas · Áreas asignadas" },
  { value: "solicitud", label: "Solicitudes" },
  { value: "asistencia_marcacion", label: "Asistencia · Marcaciones" },
  { value: "asistencia_decision", label: "Asistencia · Decisiones" },
  { value: "asistencia_jornada", label: "Asistencia · Jornada asignada" },
  { value: "asistencia_calendario", label: "Asistencia · Calendario laboral" },
  { value: "incidencias_mes", label: "Asistencia · Resumen mensual" },
];

/**
 * Acciones por las que se puede filtrar la actividad
 *
 * @remarks
 * El backend filtra por la acción técnica, no por la de negocio: una baja o una
 * reactivación son un `UPDATE`, y un `UPSERT` puede ser creación o edición.
 */
export const ACCION_OPTIONS: { value: string; label: string }[] = [
  { value: "CREATE", label: "Creación" },
  { value: "UPDATE", label: "Edición, baja o reactivación" },
  { value: "DELETE", label: "Eliminación" },
  { value: "UPSERT", label: "Creación o edición" },
  { value: "CREATEMANY", label: "Creación masiva" },
  { value: "UPDATEMANY", label: "Edición masiva" },
  { value: "DELETEMANY", label: "Eliminación masiva" },
];

/** Módulo de las solicitudes, el único cuyo registro tiene una pantalla de detalle */
export const MODULO_SOLICITUD = "solicitud";

/** Nombre de cada tipo de afectado, para la etiqueta del filtro */
export const TIPO_AFECTADO_LABEL: Record<TipoAfectadoAuditoria, string> = {
  empleado: "Colaborador",
  area: "Área",
  cargo: "Cargo",
  jornada: "Jornada",
  empresa: "Empresa",
};

/** Tipos de afectado que acepta el filtro de la URL */
export const TIPOS_AFECTADO: readonly TipoAfectadoAuditoria[] = [
  "empleado",
  "area",
  "cargo",
  "jornada",
  "empresa",
];

/** Color de la insignia de cada acción de negocio (`accion_etiqueta`) */
const ACCION_TONE: Record<string, StatusTone> = {
  Creación: "success",
  Edición: "info",
  Baja: "warning",
  Reactivación: "success",
  Eliminación: "danger",
};

/** Nombre legible de un módulo; uno desconocido se muestra tal cual */
export const getTablaLabel = (tabla: string): string =>
  TABLA_OPTIONS.find((option) => option.value === tabla)?.label ?? tabla;

/** Nombre legible de una acción técnica; una desconocida se muestra tal cual */
export const getAccionLabel = (accion: string): string =>
  ACCION_OPTIONS.find((option) => option.value === accion)?.label ?? accion;

/** Tono de la insignia de una acción de negocio; una desconocida es neutral */
export const getAccionTone = (accionEtiqueta: string): StatusTone =>
  ACCION_TONE[accionEtiqueta] ?? "neutral";
