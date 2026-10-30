import type { PaginationMeta } from "@/lib/api/types/api.types";
import type {
  CambiarEstadoLaboralDto,
  EstadoEmpleado,
} from "@jyp/shared-contracts";

/**
 * Estado operativo de un empleado dentro de la empresa
 */
export type EstadoLaboral = EstadoEmpleado;

/**
 * Estados a los que RRHH puede cambiar a un empleado desde la lista
 */
export type EstadoLaboralEditable = CambiarEstadoLaboralDto["estado_laboral"];

/**
 * Datos mínimos de una relación (área o cargo)
 */
export interface EmpleadoRelacion {
  id: string;
  nombre: string;
}

/**
 * Jornada asignada al empleado
 */
export interface EmpleadoJornada extends EmpleadoRelacion {
  turno: string;
}

/**
 * Empleado tal como lo devuelve el listado
 *
 * @remarks
 * Incluye lo que usan la lista y la ficha. El backend también envía los ids
 * de área, cargo y jornada, y los datos financieros.
 */
export interface Empleado {
  id: string;
  estado_laboral: EstadoLaboral;
  nombre: string;
  apellido: string;
  nro_documento: string;
  email: string | null;
  telefono: string | null;
  documento_id?: string;
  sexo?: string | null;
  estado_civil?: string | null;
  nacionalidad?: string | null;
  fecha_nacimiento?: string | null;
  direccion?: string | null;
  referencia_direccion?: string | null;
  departamento?: string | null;
  provincia?: string | null;
  distrito?: string | null;
  ubigeo?: string | null;
  asig_familiar?: boolean;
  fecha_inicio: string | null;
  fecha_cese: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  area: EmpleadoRelacion;
  cargo: EmpleadoRelacion;
  jornada: EmpleadoJornada | null;
}

/**
 * Filtros del listado de empleados
 */
export interface EmpleadoFilters {
  page: number;
  limit: number;
  search?: string;
  area_id?: string;
  cargo_id?: string;
  jornada_id?: string;
  activo?: boolean;
}

/**
 * Filtros del listado que se eligen desde un selector
 */
export type EmpleadoFilterKey =
  | "area_id"
  | "cargo_id"
  | "jornada_id"
  | "activo";

/**
 * Página de empleados con sus datos de paginación
 */
export interface EmpleadosPage {
  items: Empleado[];
  pagination: PaginationMeta;
}
