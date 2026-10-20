import type { PaginationMeta } from "@/lib/api/types/api.types";
import type { EstadoEmpleado } from "@jyp/shared-contracts";

/**
 * Estado operativo de un empleado dentro de la empresa
 */
export type EstadoLaboral = EstadoEmpleado;

/**
 * Estados a los que RRHH puede cambiar a un empleado desde la lista
 */
export type EstadoLaboralEditable = Exclude<EstadoEmpleado, "CESADO">;

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
 * Datos financieros visibles en la lista
 */
export interface EmpleadoDatoFinanciero {
  sueldo_basico: string;
  regimen_salud: string | null;
}

/**
 * Empleado tal como lo devuelve el listado
 */

export interface Empleado {
  id: string;
  estado_laboral: EstadoLaboral;
  nombre: string;
  apellido: string;
  nro_documento: string;
  email: string | null;
  telefono: string | null;
  fecha_inicio: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  area: EmpleadoRelacion;
  cargo: EmpleadoRelacion;
  jornada: EmpleadoJornada | null;
  dato_financiero: EmpleadoDatoFinanciero | null;
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
 * Página de empleados con sus datos de paginación
 */
export interface EmpleadosPage {
  items: Empleado[];
  pagination: PaginationMeta;
}
