import type { CrearContratoDto, CrearJornadaDto, CrearSolicitudDto, DiaHorarioDto, MarcarAsistenciaDto } from "@jyp/shared-contracts";
import type { EmpleadoMock } from "./empleados.types";

// Conserva los campos del contrato y añade los datos que entrega el listado
export type ContratoEmpleado = CrearContratoDto & {
  id: string;
  dias_restantes: number | null;
  alerta_vencimiento: "VENCIDO" | "CRITICO" | "PREVENTIVO" | "REGULAR" | null;
  es_prorroga: boolean;
  tiene_archivo: boolean;
  url_documento: string | null;
};

export type JornadaEmpleado = Omit<CrearJornadaDto, "areas_ids"> & {
  id: string;
  total_horas_semana: number;
};

// Las fechas de una respuesta HTTP llegan como texto
export type MarcacionEmpleado = Omit<MarcarAsistenciaDto, "fecha_hora"> & {
  id: string;
  empleado_id: string;
  colaborador: string;
  fecha_hora: string;
  metodo: string;
};

export interface AsistenciaDia {
  fecha: string;
  dia: DiaHorarioDto["dia"];
  marcaciones: MarcacionEmpleado[];
}

export type PeriodoLaboralEmpleado = Pick<EmpleadoMock, "fecha_inicio" | "fecha_cese">;
export type SolicitudAsistenciaAprobada = Pick<CrearSolicitudDto, "tipo" | "fecha_inicio" | "fecha_fin">;

// Resultados de presentacion para el calculo diario de esta vista
export type EstadoAsistenciaDia = "PUNTUAL" | "TARDANZA" | "FALTA" | "PENDIENTE" | "DESCANSO" | "SIN_JORNADA" | "FUERA_PERIODO" | "JUSTIFICADO";

export interface ResultadoAsistenciaDia {
  estado: EstadoAsistenciaDia;
  minutos_tardanza: number;
  minutos_netos: number | null;
}
