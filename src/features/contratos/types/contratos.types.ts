/**
 * Contrato de un empleado tal como lo devuelve el listado por empleado del backend
 *
 * @remarks
 * No es `ContratoDetalleDto` del contrato compartido: ese es el detalle por id.
 */
export interface Contrato {
  id: string;
  estado: "VIGENTE" | "RENOVADO" | "VENCIDO" | "ANULADO" | "FINALIZADO";
  tipo_modalidad: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  dias_restantes: number | null;
  alerta_vencimiento: "VENCIDO" | "CRITICO" | "PREVENTIVO" | "REGULAR" | null;
  es_prorroga: boolean;
  tiene_archivo: boolean;
}
