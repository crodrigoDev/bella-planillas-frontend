import type {
  EstadoSolicitud,
  EvaluarSolicitudDto,
  TipoSolicitud,
} from "@jyp/shared-contracts";

import type { PaginationMeta } from "@/lib/api/types/api.types";

export type { EstadoSolicitud, TipoSolicitud };

/** Cómo afecta una solicitud aprobada a la asistencia del colaborador */
export type EfectoAsistencia = NonNullable<
  EvaluarSolicitudDto["efecto_asistencia"]
>;

/** Responsable de la revisión de una solicitud */
export interface SolicitudResponsable {
  /** Id del usuario, el mismo que `useAuth().user.id` */
  id: string;
  nombre_completo: string;
}

/** Área o cargo tal como lo devuelve el listado */
export interface SolicitudReferencia {
  id: string;
  nombre: string;
}

/**
 * Solicitud en el listado
 *
 * @remarks
 * `monto` llega como texto decimal y las fechas como `YYYY-MM-DD` (o ISO
 * completo). `fecha_limite` es el plazo para resolverla.
 */
export interface Solicitud {
  id: string;
  codigo: string;
  empleado_id: string;
  tipo: TipoSolicitud;
  estado: EstadoSolicitud;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  dias_solicitados: number | null;
  monto: string | null;
  fecha_limite: string | null;
  created_at: string;
  colaborador: {
    id: string;
    nombre_completo: string;
    area: SolicitudReferencia;
    cargo: SolicitudReferencia;
  };
  responsable: SolicitudResponsable | null;
}

/** Conteo de solicitudes por estado, sin aplicar el filtro de estado */
export type SolicitudesPorEstado = Record<EstadoSolicitud, number>;

/** Página de solicitudes con sus datos de paginación y los conteos por estado */
export interface SolicitudesPage {
  items: Solicitud[];
  pagination: PaginationMeta;
  /** Total con los demás filtros pero sin el de estado (pestaña "Todas") */
  totalSinEstado: number;
  porEstado: SolicitudesPorEstado;
}

/** Resumen del colaborador que muestra el detalle */
export interface ColaboradorResumen {
  id: string;
  nombre_completo: string;
  documento: string;
  area: string;
  cargo: string;
  /** Texto ya armado por el backend, por ejemplo "2 años 3 meses" */
  antiguedad: string;
}

/** Aviso de una solicitud abierta cuyo periodo ya empezó o cuyo plazo venció */
export interface AlertaUrgencia {
  mensaje: string;
  detalle: string;
}

/**
 * Solicitud completa (`GET :idOCodigo`)
 *
 * @remarks
 * El backend no ofrece descarga del sustento: solo se conoce su nombre.
 * `hora_inicio` y `hora_fin` son `HH:mm`. El servicio ya deja el responsable
 * con el mismo formato que el listado.
 */
export interface SolicitudDetalle {
  id: string;
  codigo: string;
  empleado_id: string;
  tipo: TipoSolicitud;
  estado: EstadoSolicitud;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  dias_solicitados: number | null;
  monto: string | null;
  fecha_limite: string | null;
  motivo: string;
  observacion: string | null;
  sustento_nombre: string | null;
  efecto_asistencia: EfectoAsistencia;
  origen: string;
  created_at: string;
  responsable: SolicitudResponsable | null;
  colaborador_resumen: ColaboradorResumen;
  alerta_urgencia: AlertaUrgencia | null;
}

/** Cosas que pasan en una solicitud y quedan en su historial */
export type AccionHistorial =
  | "CREADA"
  | "INICIO_REVISION"
  | "APROBADA"
  | "RECHAZADA"
  | "ANULADA"
  | "ASIGNADA"
  | "REASIGNADA"
  | "DESASIGNADA"
  | "ACTUALIZADA"
  | "ELIMINADA";

/** Cambio de un campo entre antes y después de un evento */
export interface CambioHistorial<T> {
  anterior: T | null;
  nuevo: T | null;
}

/** Un evento del historial de una solicitud */
export interface EventoSolicitud {
  id: string;
  accion: AccionHistorial;
  fecha: string;
  actor: {
    id: string | null;
    email: string | null;
    nombre_completo: string;
  };
  cambios: {
    estado: CambioHistorial<EstadoSolicitud>;
    responsable_id: CambioHistorial<string>;
    observacion: CambioHistorial<string>;
  };
}

/** Filtros del listado de solicitudes */
export interface SolicitudFilters {
  page: number;
  limit: number;
  /** Código, motivo, nombre o documento del colaborador */
  search?: string;
  estado?: EstadoSolicitud;
  tipo?: TipoSolicitud;
  area_id?: string;
  /** Sobre la fecha de creación (YYYY-MM-DD) */
  fecha_desde?: string;
  fecha_hasta?: string;
}

/** Filtros del listado que se cambian de uno en uno */
export type SolicitudFilterKey = "search" | "estado" | "tipo" | "area_id";

/**
 * Datos para crear una solicitud, con lo que el backend acepta desde RRHH
 *
 * @remarks
 * No lleva `origen`: el backend pone `MANUAL_RRHH`. Los campos que no
 * aplican al tipo no se envían.
 */
export interface NuevaSolicitudDto {
  empleado_id: string;
  tipo: TipoSolicitud;
  motivo: string;
  observacion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  hora_inicio?: string;
  hora_fin?: string;
  dias_solicitados?: number;
  monto?: number;
}

/** Lo que devuelve el backend al crear: lo necesario para abrir el detalle */
export interface SolicitudCreada {
  id: string;
  codigo: string;
}

/** Lo que necesitan los modales de acción: lo comparten el listado y el detalle */
export type SolicitudAccionable = Pick<Solicitud, "id" | "codigo" | "tipo">;

/** Acciones que RRHH puede hacer sobre una solicitud */
export type AccionSolicitud = "tomar" | "aprobar" | "rechazar" | "anular";

/**
 * Qué acciones se pueden hacer sobre una solicitud
 *
 * @remarks
 * `null` = la acción se puede hacer; un texto = no se puede y es el motivo
 * (sirve de tooltip del botón deshabilitado).
 */
export type AccionesSolicitud = Record<AccionSolicitud, string | null>;
