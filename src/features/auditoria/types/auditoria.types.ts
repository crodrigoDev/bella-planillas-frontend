import type { PaginationMeta } from "@/lib/api/types/api.types";
import type { CambioCampo } from "@/lib/types/cambios.types";

/** Empleado vinculado al usuario que hizo la acción */
export interface AuditoriaEmpleado {
  nro_documento: string;
  nombre: string;
  apellido: string;
}

/** Usuario que hizo la acción */
export interface AuditoriaUsuario {
  email: string;
  rol: string;
  empleados: AuditoriaEmpleado | null;
}

/**
 * Fila del listado de auditoría (sin los valores antes y después)
 *
 * @remarks
 * `usuarios` es null cuando la acción la hizo el sistema.
 */
export interface AuditoriaLog {
  id: string;
  usuario_id: string | null;
  accion: string;
  tabla_afectada: string;
  registro_id: string;
  direccion_ip: string;
  created_at: string;
  usuarios: AuditoriaUsuario | null;
}

/**
 * Detalle de una fila de auditoría (`GET logs/:id`)
 *
 * @remarks
 * Trae los valores, pero no el usuario. `cambios` los calcula el backend: todos
 * los campos en una creación y solo los que cambian en una modificación, con su
 * etiqueta en español y sin los campos técnicos.
 */
export interface AuditoriaDetalle {
  id: string;
  usuario_id: string | null;
  accion: string;
  tabla_afectada: string;
  registro_id: string;
  direccion_ip: string;
  created_at: string;
  valores_antes: Record<string, unknown> | null;
  valores_despues: Record<string, unknown> | null;
  cambios: CambioCampo[];
  campos_modificados: string[];
}

/** Filtros del listado de auditoría */
export interface AuditoriaFilters {
  page: number;
  limit: number;
  tabla_afectada?: string;
  accion?: string;
  usuario_id?: string;
  registro_id?: string;
}

/** Filtros que se cambian de uno en uno */
export type AuditoriaFilterKey = "tabla_afectada" | "accion";

/** Página de auditoría con sus datos de paginación */
export interface AuditoriaPage {
  items: AuditoriaLog[];
  pagination: PaginationMeta;
}
