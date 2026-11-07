import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { ReglasArchivo } from "@/lib/archivo.utils";
import type { SelectOption } from "@/lib/types/options.types";
import type {
  AccionHistorial,
  EfectoAsistencia,
  EstadoSolicitud,
  TipoSolicitud,
} from "../types/solicitudes.types";

/**
 * Tipos que la base de datos acepta de verdad
 *
 * @remarks
 * `ADELANTO_VACACIONES` y `VENTA_VACACIONES` están en el contrato pero el
 * backend los rechaza ("aún no está habilitado"), por eso no se ofrecen.
 */
export const TIPOS_SOLICITUD = [
  "VACACIONES",
  "LICENCIA_MEDICA",
  "PERMISO",
  "JUSTIFICACION_ASISTENCIA",
  "ACTUALIZACION_DATOS",
  "ADELANTO_SUELDO",
  "RENUNCIA",
] as const satisfies readonly TipoSolicitud[];

/** Un tipo que se puede registrar y filtrar */
export type TipoSolicitudActivo = (typeof TIPOS_SOLICITUD)[number];

/** Nombre de cada tipo (incluye los dos que no se ofrecen, por si llegan en un dato viejo) */
const TIPO_LABELS: Record<TipoSolicitud, string> = {
  VACACIONES: "Vacaciones",
  ADELANTO_VACACIONES: "Adelanto de vacaciones",
  VENTA_VACACIONES: "Venta de vacaciones",
  LICENCIA_MEDICA: "Licencia médica",
  PERMISO: "Permiso",
  JUSTIFICACION_ASISTENCIA: "Justificación de asistencia",
  ACTUALIZACION_DATOS: "Actualización de datos",
  ADELANTO_SUELDO: "Adelanto de sueldo",
  RENUNCIA: "Renuncia",
};

/** Opciones de tipo para el formulario y el filtro */
export const TIPO_OPTIONS: SelectOption[] = TIPOS_SOLICITUD.map((value) => ({
  value,
  label: TIPO_LABELS[value],
}));

/** Nombre de un tipo para mostrar */
export const getTipoLabel = (tipo: TipoSolicitud): string => TIPO_LABELS[tipo];

/** Estados en el orden de las pestañas del listado */
export const ESTADOS_SOLICITUD: EstadoSolicitud[] = [
  "PENDIENTE",
  "EN_REVISION",
  "APROBADA",
  "RECHAZADA",
  "ANULADA",
];

/** Nombre y color de cada estado */
const ESTADO_CONFIG: Record<
  EstadoSolicitud,
  { label: string; tone: StatusTone }
> = {
  PENDIENTE: { label: "Pendiente", tone: "warning" },
  EN_REVISION: { label: "En revisión", tone: "info" },
  APROBADA: { label: "Aprobada", tone: "success" },
  RECHAZADA: { label: "Rechazada", tone: "danger" },
  ANULADA: { label: "Anulada", tone: "neutral" },
};

/** Nombre de un estado para mostrar */
export const getEstadoLabel = (estado: EstadoSolicitud): string =>
  ESTADO_CONFIG[estado].label;

/** Color de la insignia de un estado */
export const getEstadoTone = (estado: EstadoSolicitud): StatusTone =>
  ESTADO_CONFIG[estado].tone;

/** Nombre de cada efecto en la asistencia */
const EFECTO_LABELS: Record<EfectoAsistencia, string> = {
  PENDIENTE_DEFINIR: "Sin definir",
  CON_GOCE: "Con goce de haber",
  SIN_GOCE: "Sin goce de haber",
  NO_APLICA: "No aplica",
};

/**
 * Nombre de un efecto en la asistencia para mostrar
 *
 * @remarks
 * La base de datos admite también `SUBSIDIO`, que no está en el contrato: un
 * valor sin nombre se muestra tal cual.
 */
export const getEfectoLabel = (efecto: string): string =>
  EFECTO_LABELS[efecto as EfectoAsistencia] ?? efecto;

/** Efectos que RRHH elige al aprobar (los demás los fija el sistema) */
export const EFECTO_ELEGIBLE_OPTIONS: SelectOption[] = [
  { value: "CON_GOCE", label: EFECTO_LABELS.CON_GOCE },
  { value: "SIN_GOCE", label: EFECTO_LABELS.SIN_GOCE },
];

/** Tipos que afectan los días de asistencia: piden fechas de inicio y fin */
export const TIPOS_CON_FECHAS: readonly TipoSolicitud[] = [
  "VACACIONES",
  "LICENCIA_MEDICA",
  "PERMISO",
  "JUSTIFICACION_ASISTENCIA",
];

/** Tipos que se pueden pedir por horas (un solo día) */
export const TIPOS_CON_HORAS: readonly TipoSolicitud[] = [
  "PERMISO",
  "JUSTIFICACION_ASISTENCIA",
];

/** Tipos que piden monto */
export const TIPOS_CON_MONTO: readonly TipoSolicitud[] = ["ADELANTO_SUELDO"];

/** Tipos cuyo efecto en la asistencia elige RRHH al aprobar */
export const TIPOS_EFECTO_ELEGIBLE: readonly TipoSolicitud[] = [
  "LICENCIA_MEDICA",
  "PERMISO",
  "JUSTIFICACION_ASISTENCIA",
];

/** Tipos que piden la cantidad de días (se calcula desde las fechas y se puede cambiar) */
export const TIPOS_CON_DIAS: readonly TipoSolicitud[] = [
  "VACACIONES",
  "LICENCIA_MEDICA",
  "PERMISO",
];

/** Máximo de días para unas vacaciones */
export const MAX_DIAS_VACACIONES = 365;

/** Límites de texto que aplica el backend */
export const LIMITES = {
  motivo: { min: 5, max: 1500 },
  observacion: { max: 2000 },
  rechazo: { min: 5, max: 2000 },
  anulacion: { min: 5, max: 3000 },
} as const;

/** Reglas del sustento: PDF o Word de hasta 5 MB */
export const SUSTENTO_REGLAS: ReglasArchivo = {
  tipos: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  extensiones: [".pdf", ".doc", ".docx"],
  maxBytes: 5 * 1024 * 1024,
  descripcionTipo: "un PDF o un documento de Word",
  nombre: "El sustento",
};

/** Valor de `accept` del selector de archivos del sustento */
export const SUSTENTO_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Nombre de cada origen de la solicitud */
const ORIGEN_LABELS: Record<string, string> = {
  PORTAL_EMPLEADO: "Portal del colaborador",
  MANUAL_RRHH: "Registrada por RRHH",
  APLICACION_MOVIL: "Aplicación móvil",
};

/** Nombre del origen de una solicitud; si llega uno desconocido se muestra tal cual */
export const getOrigenLabel = (origen: string): string =>
  ORIGEN_LABELS[origen] ?? origen;

/** Frase de cada evento del historial */
const ACCION_HISTORIAL_LABELS: Record<AccionHistorial, string> = {
  CREADA: "Solicitud registrada",
  INICIO_REVISION: "Tomó la solicitud para revisarla",
  APROBADA: "Aprobó la solicitud",
  RECHAZADA: "Rechazó la solicitud",
  ANULADA: "Anuló la solicitud",
  ASIGNADA: "Asignó un responsable",
  REASIGNADA: "Cambió el responsable",
  DESASIGNADA: "Quitó al responsable",
  ACTUALIZADA: "Actualizó la solicitud",
  ELIMINADA: "Eliminó la solicitud",
};

/** Frase de un evento del historial para mostrar */
export const getAccionHistorialLabel = (accion: AccionHistorial): string =>
  ACCION_HISTORIAL_LABELS[accion] ?? accion;

/** Color del punto de cada evento del historial */
export const getAccionHistorialTone = (
  accion: AccionHistorial,
): StatusTone => {
  switch (accion) {
    case "APROBADA":
      return "success";
    case "RECHAZADA":
      return "danger";
    case "INICIO_REVISION":
    case "ASIGNADA":
    case "REASIGNADA":
      return "info";
    default:
      return "neutral";
  }
};
