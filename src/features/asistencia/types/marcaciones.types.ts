import type { PaginationMeta } from "@/lib/api/types/api.types";
import type { TipoMarca } from "./asistencia.types";

/**
 * Una marcación del listado global
 *
 * @remarks
 * `fecha_hora` llega en ISO UTC: la fecha y la hora se muestran en hora de Lima.
 * `metodo` es el origen que guarda el backend (`BIOMETRICO_EXCEL`, `MANUAL`, `WEB`...).
 */
export interface Marcacion {
  id: string;
  empleado_id: string;
  colaborador: string;
  nro_documento: string;
  fecha_hora: string;
  tipo_marcacion: TipoMarca;
  metodo: string;
}

/** Tipos de marcación por los que filtra el listado (el backend solo admite estos) */
export type TipoMarcaFiltro = "ENTRADA" | "SALIDA";

/** Filtros del listado de marcaciones */
export interface MarcacionFilters {
  page: number;
  limit: number;
  empleado_id?: string;
  /** YYYY-MM-DD */
  fecha_inicio?: string;
  /** YYYY-MM-DD */
  fecha_fin?: string;
  tipo_marcacion?: TipoMarcaFiltro;
}

/** Filtros del listado que se cambian de uno en uno */
export type MarcacionFilterKey =
  | "empleado_id"
  | "fecha_inicio"
  | "fecha_fin"
  | "tipo_marcacion";

/** Página de marcaciones con sus datos de paginación */
export interface MarcacionesPage {
  items: Marcacion[];
  pagination: PaginationMeta;
}

/** Una fila del Excel que no pasó la validación */
export interface ImportacionMarcacionesError {
  /** Número de fila en el archivo */
  fila: number;
  detalle: string;
}

/** Resultado de revisar el archivo, sin guardar nada */
export interface ImportacionMarcacionesValidacion {
  archivo_hash: string;
  /** Mes de todas las marcaciones como YYYY-MM */
  periodo: string;
  filas_validas: number;
  /** El backend devuelve como máximo 100 */
  errores: ImportacionMarcacionesError[];
  /** Solo se puede importar si no hay errores */
  confirmable: boolean;
}

/** Resultado de importar el archivo */
export interface ImportacionMarcacionesResultado {
  archivo_hash: string;
  periodo: string;
  filas_validas: number;
  errores: ImportacionMarcacionesError[];
  insertadas: number;
  duplicadas_omitidas: number;
}
