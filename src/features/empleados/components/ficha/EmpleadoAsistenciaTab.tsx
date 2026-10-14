import type { JornadaEmpleado, MarcacionEmpleado, PeriodoLaboralEmpleado, SolicitudAsistenciaAprobada } from "../../types/ficha-empleado.types";
import EmpleadoJornadaCard from "./EmpleadoJornadaCard";
import EmpleadoAsistenciaSemana from "./EmpleadoAsistenciaSemana";

interface EmpleadoAsistenciaTabProps {
  jornada: JornadaEmpleado | null;
  marcaciones: MarcacionEmpleado[];
  semana: string;
  empleado: PeriodoLaboralEmpleado;
  solicitudesAprobadas?: SolicitudAsistenciaAprobada[];
  onWeekChange: (semana: string) => void;
}

/** Reune la jornada asignada y las marcaciones de la semana seleccionada */
export default function EmpleadoAsistenciaTab({ jornada, marcaciones, semana, empleado, solicitudesAprobadas, onWeekChange }: EmpleadoAsistenciaTabProps) {
  return <div className="space-y-5"><EmpleadoJornadaCard jornada={jornada} /><EmpleadoAsistenciaSemana semana={semana} jornada={jornada} marcaciones={marcaciones} empleado={empleado} solicitudesAprobadas={solicitudesAprobadas} onWeekChange={onWeekChange} /></div>;
}
