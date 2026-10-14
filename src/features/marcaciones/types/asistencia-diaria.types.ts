import type { DiaHorarioDto } from "@jyp/shared-contracts";
import type { EmpleadoMock } from "@/features/empleados/types/empleados.types";
import type {
  AsistenciaDia,
  JornadaEmpleado,
  ResultadoAsistenciaDia,
} from "@/features/empleados/types/ficha-empleado.types";

// Incompleta y en curso describen los registros de la vista, no estados del backend
export type EstadoAsistenciaRegistro =
  ResultadoAsistenciaDia["estado"] | "INCOMPLETA" | "EN_CURSO";

export interface AsistenciaRegistro extends AsistenciaDia {
  id: string;
  empleado: EmpleadoMock;
  jornada: JornadaEmpleado | null;
  horario?: DiaHorarioDto;
  resultado: Omit<ResultadoAsistenciaDia, "estado"> & {
    estado: EstadoAsistenciaRegistro;
  };
}
