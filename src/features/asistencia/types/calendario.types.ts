import type {
  CalendarioAsistenciaRespuesta,
  DiaAdicionalCalendarioDto,
  DiaCalendarioAsistencia,
} from "@jyp/shared-contracts";

/*
 * Tipos del calendario de asistencia (`/asistencia/calendario`). Los del
 * contrato compartido se reexportan; aquí solo viven los de la pantalla.
 */

export type {
  CalendarioAsistenciaRespuesta,
  DiaAdicionalCalendarioDto,
  DiaCalendarioAsistencia,
};

/** Origen de un día: feriado nacional calculado o día de descanso acordado */
export type CalendarioOrigen = DiaCalendarioAsistencia["origen"];

/** Filtros de la página; el año se pide al backend y el origen se filtra en el cliente */
export interface CalendarioFilters {
  anio: number;
  origen?: CalendarioOrigen;
}

/** Qué se está haciendo con un día acordado, para elegir el aviso de éxito */
export type AccionDiaCalendario = "CREAR" | "EDITAR" | "ACTIVAR" | "DESACTIVAR";

/**
 * Datos para guardar un día acordado
 *
 * @remarks
 * El cuerpo es el mismo para crear, editar y cambiar el estado (el backend hace
 * un upsert por fecha); la acción solo se usa para el aviso.
 */
export interface GuardarDiaCalendarioVars {
  dto: DiaAdicionalCalendarioDto;
  accion: AccionDiaCalendario;
}
