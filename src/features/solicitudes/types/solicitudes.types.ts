import type {
  CrearSolicitudDto,
  CrearSolicitudSchema,
  EvaluarSolicitudDto,
} from "@jyp/shared-contracts";

export type SolicitudFormValues = (typeof CrearSolicitudSchema)["_input"];

// El backend usa APROBADA y RECHAZADA aunque el enum de consulta tenga otro nombre
export type SolicitudEstado =
  "PENDIENTE" | "EN_REVISION" | "ANULADA" | EvaluarSolicitudDto["estado"];

export type SolicitudListado = CrearSolicitudDto & {
  id: string;
  codigo: string;
  empleado_id: string;
  estado: SolicitudEstado;
  fecha_solicitud: string;
  responsable_id: string | null;
  colaborador_resumen: {
    id: string;
    nombre_completo: string;
    documento: string;
    area: string;
    cargo: string;
  };
};

export interface SolicitudHistorial {
  id: string;
  fecha: string;
  accion: string;
  actor: { nombre_completo: string };
  cambios: {
    estado: { anterior: SolicitudEstado | null; nuevo: SolicitudEstado };
    observacion: { nuevo: string | null };
  };
}
