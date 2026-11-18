import type { PaginationMeta } from "@/lib/api/types/api.types";

/*
 * Tipos de la vista asistida de auditoría (`/core/audit/actividad` y
 * `/core/audit/afectados`). Replican el contrato del backend, que aún no está en
 * `@jyp/shared-contracts`:
 * `bella-jyp-backend/src/modules/core/audit/contracts/actividad-auditoria.schema.ts`.
 */

/** Entidad de negocio a la que se atribuye un cambio; `empresa` no tiene id */
export type TipoAfectadoAuditoria =
  | "empleado"
  | "area"
  | "cargo"
  | "jornada"
  | "empresa";

/** Tipos de afectado que tienen una línea de tiempo propia */
export type TipoAfectadoConId = Exclude<TipoAfectadoAuditoria, "empresa">;

/** Tipo de dato de un campo de negocio */
export type TipoCampoAuditoria =
  | "texto"
  | "fecha"
  | "fecha_hora"
  | "hora"
  | "booleano"
  | "moneda"
  | "numero"
  | "enum"
  | "referencia"
  | "lista";

/** Valor ya legible de un campo: texto, número, Sí/No o null si no tiene valor */
export type ValorCambio = string | number | boolean | null;

/** Un campo que cambió dentro de un elemento de una lista */
export interface CambioElemento {
  campo: string;
  etiqueta: string;
  tipo: TipoCampoAuditoria;
  antes: ValorCambio;
  despues: ValorCambio;
}

/** Elemento de una lista que cambió (por ejemplo un día del horario) con sus campos */
export interface DetalleElemento {
  elemento: string;
  etiqueta: string;
  cambios: CambioElemento[];
}

/**
 * Un campo que cambió, con sus valores ya traducidos a lenguaje de negocio
 *
 * @remarks
 * Si `protegido` es true (cuentas, CCI, CUSPP), `antes` y `despues` vienen en
 * null. Si `tipo` es `lista`, también, y el contenido está en `detalle`.
 */
export interface CambioActividad extends CambioElemento {
  protegido?: boolean;
  detalle?: DetalleElemento[];
}

/** Usuario que hizo la acción */
export interface ActorActividad {
  id: string;
  nombre: string;
  rol: string;
}

/** A quién afectó el cambio; `id` es null cuando el afectado es la empresa */
export interface AfectadoActividad {
  tipo: TipoAfectadoAuditoria;
  id: string | null;
  nombre: string;
  detalle: string | null;
}

/**
 * Fila de actividad: qué pasó, quién lo hizo y a quién afectó
 *
 * @remarks
 * `accion` es la acción técnica (la que filtra el backend) y `accion_etiqueta`
 * la de negocio. `modulo` es la tabla técnica y sirve para el filtro por módulo.
 * `registro_id` es el id de la fila modificada: solo vale para enlazar a su
 * pantalla (en operaciones masivas es un id inventado). `actor` es null si lo
 * hizo el sistema.
 */
export interface FilaActividad {
  id: string;
  /** Instante completo con zona (ISO) */
  fecha: string;
  accion: string;
  accion_etiqueta: string;
  modulo: string;
  modulo_etiqueta: string;
  registro_id: string;
  actor: ActorActividad | null;
  afectado: AfectadoActividad | null;
  resumen: string;
  campos_modificados: string[];
}

/** Detalle de una fila de actividad (`GET actividad/:id`): la fila más sus cambios */
export interface DetalleActividad extends FilaActividad {
  cambios: CambioActividad[];
}

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
