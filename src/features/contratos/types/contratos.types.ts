import type { ContratoDetalleDto } from "@jyp/shared-contracts";

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
