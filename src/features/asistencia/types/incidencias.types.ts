import type { PaginationMeta } from "@/lib/api/types/api.types";
import type { EstadoResumen } from "./asistencia.types";

/**
 * Resumen mensual de un colaborador en el listado del cierre
 *
 * @remarks
 * Solo hay filas de los colaboradores cuyo resumen ya se generó. Las horas
 * extras llegan como texto decimal (horas, no minutos).
 */
export interface Incidencia {
  id: string;
  empleado_id: string;
  colaborador: string;
  nro_documento: string;
  area: string;
  cargo: string;
  /** Mes como YYYY-MM */
  periodo: string;
  dias_trabajados: number;
  faltas: number;
  minutos_tardanza: number;
  horas_extras_25: string;
  horas_extras_35: string;
  estado: EstadoResumen;
  vigente: boolean;
  completo: boolean;
  /** Días por resolver; con más de cero no se puede aprobar */
  pendientes: number;
  version: number;
}

/** Filtros del listado del cierre mensual */
export interface IncidenciaFilters {
  page: number;
  limit: number;
  /** Mes como YYYY-MM; el backend lo exige */
  periodo: string;
  area_id?: string;
  estado?: EstadoResumen;
  /** Documento, nombre o apellido */
  busqueda?: string;
}

/** Filtros del listado que se cambian de uno en uno */
export type IncidenciaFilterKey = "area_id" | "estado" | "busqueda";

/** Página de resúmenes con sus datos de paginación */
export interface IncidenciasPage {
  items: Incidencia[];
  pagination: PaginationMeta;
}

/** Cuántos resúmenes hay en cada estado */
export type ConteoIncidencias = Record<EstadoResumen, number>;

/** Lo que se envía para generar un lote del cierre */
export interface GenerarCierreLoteDto {
  periodo: string;
  area_id?: string;
  cursor?: string;
  limite: number;
}

/** Resultado de un colaborador dentro de un lote */
export interface CierreDetalle {
  empleado_id: string;
  id?: string;
  estado?: EstadoResumen;
  /** Mensaje del backend si no se pudo calcular */
  error?: string;
}

/** Resultado de un lote del cierre */
export interface CierreLote {
  periodo: string;
  total_procesados: number;
  errores: number;
  /** Id desde donde sigue el próximo lote; null si ya no hay más */
  siguiente_cursor: string | null;
  detalle: CierreDetalle[];
}

/** Colaborador que falló al generar su resumen */
export interface CierreError {
  empleado_id: string;
  error: string;
}

/** Avance de la generación del mes, acumulado lote a lote */
export interface CierreProgreso {
  lotes: number;
  procesados: number;
  errores: CierreError[];
}

/** Resultado de aprobar todos los pendientes del mes */
export interface AprobarMesResultado {
  periodo: string;
  registros_aprobados: number;
}
