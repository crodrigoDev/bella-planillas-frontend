import type { ContratoDetalleDto } from "@jyp/shared-contracts";
import type { PaginationMeta } from "@/lib/api/types/api.types";

/** Estados posibles de un contrato */
export type EstadoContrato = ContratoDetalleDto["estado"];

/**
 * Contrato de un empleado tal como lo devuelve el listado por empleado del backend
 *
 * @remarks
 * No es `ContratoDetalleDto` del contrato compartido: ese es el detalle por id.
 */
export interface Contrato {
  id: string;
  estado: EstadoContrato;
  tipo_modalidad: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  dias_restantes: number | null;
  alerta_vencimiento: "VENCIDO" | "CRITICO" | "PREVENTIVO" | "REGULAR" | null;
  contrato_origen_id: string | null;
  es_prorroga: boolean;
  tiene_archivo: boolean;
}

/** Detalle de un contrato; es el único que trae la `url` del PDF */
export type ContratoDetalle = ContratoDetalleDto;

/**
 * Fila del listado global de contratos (`GET /rrhh/contrato`)
 *
 * @remarks
 * Es un `Contrato` con los datos del colaborador. Las fechas llegan como ISO
 * con hora. `area`, `cargo` y `tipo_modalidad` traen un texto de reemplazo
 * ("Sin Área", "Sin Cargo", "No especificado") cuando no hay dato. No trae si el
 * empleado está activo, ni la `url` del PDF, ni la observación.
 */
export interface ContratoGlobal extends Contrato {
  empleado_id: string;
  /** "Nombre Apellido" */
  colaborador: string;
  nro_documento: string;
  area: string;
  cargo: string;
}

/** Estados por los que filtra el listado global (los anulados nunca se devuelven) */
export type EstadoContratoFiltro = Exclude<EstadoContrato, "ANULADO">;

/** Días de anticipación que ofrece el filtro "Por vencer" */
export type PorVencerDias = 15 | 30 | 60;

/**
 * Filtros del listado global de contratos
 *
 * @remarks
 * Con `por_vencer_dias` el backend fuerza `estado = VIGENTE` y ordena por fecha
 * de fin; por eso este filtro nunca viaja junto con `estado`.
 */
export interface ContratoFilters {
  page: number;
  limit: number;
  /** Nombre, apellido o documento del colaborador */
  search?: string;
  estado?: EstadoContratoFiltro;
  area_id?: string;
  por_vencer_dias?: PorVencerDias;
}

/** Filtros del listado que se cambian de uno en uno desde un selector */
export type ContratoFilterKey = "estado" | "area_id" | "por_vencer_dias";

/** Página de contratos con sus datos de paginación */
export interface ContratosPage {
  items: ContratoGlobal[];
  pagination: PaginationMeta;
}
