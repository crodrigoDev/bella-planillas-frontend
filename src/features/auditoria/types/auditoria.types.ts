import type {
  CambioActividadAuditoria,
  DetalleActividadAuditoria,
  DetalleElementoAuditoria,
  FilaActividadAuditoria,
  TipoAfectadoAuditoria,
  TipoCampoAuditoria,
  ValorCambioAuditoria,
} from "@jyp/shared-contracts";
import type { PaginationMeta } from "@/lib/api/types/api.types";

/*
 * Tipos de la vista asistida de auditoría (`/core/audit/actividad` y
 * `/core/audit/afectados`). Vienen del contrato compartido
 * `@jyp/shared-contracts`; aquí solo se reexportan con los nombres del feature.
 */

export type { TipoAfectadoAuditoria, TipoCampoAuditoria };

/** Tipos de afectado que tienen una línea de tiempo propia (`empresa` no tiene id) */
export type TipoAfectadoConId = Exclude<TipoAfectadoAuditoria, "empresa">;

/** Valor ya legible de un campo: texto, número, Sí/No o null si no tiene valor */
export type ValorCambio = ValorCambioAuditoria;

/** Elemento de una lista que cambió (por ejemplo un día del horario) con sus campos */
export type DetalleElemento = DetalleElementoAuditoria;

/** Un campo que cambió dentro de un elemento de una lista */
export type CambioElemento = DetalleElemento["cambios"][number];

/**
 * Un campo que cambió, con sus valores ya traducidos a lenguaje de negocio
 *
 * @remarks
 * Si `protegido` es true (cuentas, CCI, CUSPP), `antes` y `despues` vienen en
 * null. Si `tipo` es `lista`, también, y el contenido está en `detalle`.
 */
export type CambioActividad = CambioActividadAuditoria;

/**
 * Fila de actividad: qué pasó, quién lo hizo y a quién afectó
 *
 * @remarks
 * `accion` es la acción técnica (la que filtra el backend) y `accion_etiqueta`
 * la de negocio. `modulo` es la tabla técnica y sirve para el filtro por módulo.
 * `registro_id` es el id de la fila modificada: solo vale para enlazar a su
 * pantalla (en operaciones masivas es un id inventado). `actor` es null si lo
 * hizo el sistema; `fecha` es el instante completo con zona (ISO).
 */
export type FilaActividad = FilaActividadAuditoria;

/** Usuario que hizo la acción */
export type ActorActividad = NonNullable<FilaActividad["actor"]>;

/** A quién afectó el cambio; `id` es null cuando el afectado es la empresa */
export type AfectadoActividad = NonNullable<FilaActividad["afectado"]>;

/** Detalle de una fila de actividad (`GET actividad/:id`): la fila más sus cambios */
export type DetalleActividad = DetalleActividadAuditoria;

/**
 * Filtros del listado de actividad
 *
 * @remarks
 * `desde` y `hasta` son días `YYYY-MM-DD` en hora de Lima, ambos inclusive.
 */
export interface AuditoriaFilters {
  page: number;
  limit: number;
  tabla_afectada?: string;
  accion?: string;
  usuario_id?: string;
  afectado_tipo?: TipoAfectadoAuditoria;
  afectado_id?: string;
  desde?: string;
  hasta?: string;
}

/**
 * Usuario que puede aparecer como autor de un cambio (`GET /core/usuarios`)
 *
 * @remarks
 * Es la forma en que el backend devuelve cada cuenta en el listado: los campos
 * de paginación vienen en `meta`. `empleados` es null si la cuenta no tiene
 * colaborador asociado; el nombre del filtro sale de ahí o, si no hay, del
 * correo.
 */
export interface UsuarioBusqueda {
  id: string;
  email: string;
  rol: string;
  activo: boolean;
  ultimo_acceso: string | null;
  created_at: string;
  empleados: {
    id: string;
    nro_documento: string;
    nombre: string;
    apellido: string;
    estado_laboral: string;
    area: { id: string; nombre: string } | null;
    cargo: { id: string; nombre: string } | null;
  } | null;
}

/** Filtros que se cambian de uno en uno */
export type AuditoriaFilterKey = "tabla_afectada" | "accion";

/** Parámetros de la línea de tiempo de un afectado */
export interface AfectadoParams {
  page: number;
  limit: number;
  desde?: string;
  hasta?: string;
}

/** Página de actividad con sus datos de paginación */
export interface AuditoriaPage {
  items: FilaActividad[];
  pagination: PaginationMeta;
}

/**
 * Estado que viaja con el enlace al detalle de un registro
 *
 * @remarks
 * `volverA` es la ruta (con sus filtros) desde la que se llegó, para que el
 * enlace "Volver" de la página de detalle la recupere.
 */
export interface DetalleLocationState {
  volverA?: string;
}
