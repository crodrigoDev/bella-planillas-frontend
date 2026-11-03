/** Tipos de marcación de un día */
export type TipoMarca =
  | "ENTRADA"
  | "SALIDA_ALMUERZO"
  | "ENTRADA_ALMUERZO"
  | "SALIDA";

/** Estado del resumen de un mes: lo revisa y aprueba RRHH */
export type EstadoResumen = "PENDIENTE" | "APROBADO" | "RECHAZADO";

/** Una marcación dentro del detalle de un día */
export interface MarcaDia {
  tipo: TipoMarca;
  /** Hora de Lima como HH:mm */
  hora: string;
  origen?: string;
}

/**
 * Un día del detalle mensual, ya calculado por el backend
 *
 * @remarks
 * El `estado` es un código (`ASISTENCIA_REGISTRADA`, `FALTA_INJUSTIFICADA`...):
 * se muestra con `ESTADO_DIA`. Las `alertas` son códigos que piden revisión.
 */
export interface DiaAsistencia {
  /** Fecha como YYYY-MM-DD */
  fecha: string;
  estado: string;
  modalidad: string | null;
  marcas: MarcaDia[];
  solicitudes: string[];
  minutos_programados: number;
  minutos_trabajados: number;
  minutos_tardanza: number;
  minutos_salida_anticipada: number;
  minutos_sin_goce: number;
  minutos_extra_observados: number;
  minutos_extra_25: number;
  minutos_extra_35: number;
  falta: number;
  sin_goce: number;
  alertas: string[];
}

/**
 * Resumen de asistencia de un empleado en un mes
 *
 * @remarks
 * Es la fila `incidencias_mes` del backend. `detalle.dias` trae el día por día.
 * Solo existe después de generarlo: antes, el backend responde 404.
 */
export interface ResumenMes {
  id: string;
  empleado_id: string;
  /** Mes como YYYY-MM */
  periodo: string;
  dias_vinculo: number;
  dias_trabajados: number;
  faltas: number;
  dias_sin_goce: number;
  minutos_tardanza: number;
  minutos_salida_anticipada: number;
  minutos_sin_goce: number;
  minutos_extras_25: number;
  minutos_extras_35: number;
  /** Días con alertas por resolver; con más de cero no se puede aprobar */
  pendientes: number;
  completo: boolean;
  vigente: boolean;
  version: number;
  estado: EstadoResumen;
  motivo_revision: string | null;
  detalle: { version_motor: string; dias: DiaAsistencia[] } | null;
}
