import type { PaginationMeta } from "@/lib/api/types/api.types";
import type {
  DiaHorarioDto,
  DuracionJornada,
  ModalidadJornada,
  PatronRotacionDto,
  TurnoJornada,
} from "@jyp/shared-contracts";

/** Día de la semana como lo escribe el contrato (`LUNES`...) */
export type DiaSemana = DiaHorarioDto["dia"];

/** Área vinculada a una jornada */
export interface JornadaArea {
  id: string;
  nombre: string;
}

/**
 * Jornada en el listado
 *
 * @remarks
 * `total_empleados` cuenta solo a los empleados activos; con más de cero la
 * jornada no se puede desactivar.
 */
export interface Jornada {
  id: string;
  nombre: string;
  descripcion: string | null;
  duracion: DuracionJornada;
  turno: TurnoJornada;
  modalidad: ModalidadJornada;
  tolerancia_minutos: number;
  total_horas_semana: number;
  activo: boolean;
  total_empleados: number;
  total_areas: number;
  areas: JornadaArea[];
}

/** Un día del horario semanal tal como lo guarda y devuelve el backend */
export interface JornadaDia {
  dia: DiaSemana;
  laborable: boolean;
  modalidad: "PRESENCIAL" | "REMOTO";
  entrada?: string | null;
  inicio_descanso?: string | null;
  fin_descanso?: string | null;
  salida?: string | null;
  total_horas?: number;
}

/**
 * Jornada con su horario de los siete días y sus áreas (`GET :id`)
 *
 * @remarks
 * `total_horas_semana` llega como texto decimal en el detalle y como número en
 * el listado. Las áreas vienen dentro de `jornada_areas`.
 */
export interface JornadaDetalle {
  id: string;
  nombre: string;
  descripcion: string | null;
  duracion: DuracionJornada;
  turno: TurnoJornada;
  modalidad: ModalidadJornada;
  tolerancia_minutos: number;
  total_horas_semana: number | string;
  horario_semanal: JornadaDia[];
  patron_rotacion: PatronRotacionDto | null;
  activo: boolean;
  jornada_areas: { area: JornadaArea }[];
}

/** Filtros del listado de jornadas */
export interface JornadaFilters {
  page: number;
  limit: number;
  /** Nombre o descripción */
  search?: string;
  area_id?: string;
  turno?: TurnoJornada;
  modalidad?: ModalidadJornada;
  duracion?: DuracionJornada;
}

/** Filtros del listado que se cambian de uno en uno */
export type JornadaFilterKey =
  "search" | "area_id" | "turno" | "modalidad" | "duracion";

/** Página de jornadas con sus datos de paginación */
export interface JornadasPage {
  items: Jornada[];
  pagination: PaginationMeta;
}
