import type {
  CrearNovedadPlanillaDto,
  ResolverNovedadPlanillaDto,
} from "@jyp/shared-contracts";

/** Tipos admitidos para una novedad de planilla */
export type TipoNovedad = CrearNovedadPlanillaDto["tipo"];

/** Estados posibles de una novedad de planilla */
export type EstadoNovedad =
  | "PENDIENTE"
  | "APROBADO"
  | "RECHAZADO"
  | "ANULADO";

/** Acciones de resolución permitidas sobre una novedad */
export type AccionNovedad = ResolverNovedadPlanillaDto["estado"];

/** Registro de una novedad de planilla devuelto por el listado */
export interface NovedadPlanilla {
  id: string;
  empleado_id: string;
  periodo: string;
  tipo: TipoNovedad;
  monto: string;
  motivo: string;
  referencia_evidencia: string;
  estado: EstadoNovedad;
  registrado_por: string;
  resuelto_por: string | null;
  motivo_resolucion: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

/** Filtros obligatorios para consultar las novedades de un colaborador en un mes */
export interface NovedadesFilters {
  empleadoId: string;
  periodo: string;
}
