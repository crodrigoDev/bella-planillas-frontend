import { TipoMarcacion, type DiaHorarioDto } from "@jyp/shared-contracts";
import type { AsistenciaDia, JornadaEmpleado, MarcacionEmpleado, PeriodoLaboralEmpleado, ResultadoAsistenciaDia, SolicitudAsistenciaAprobada } from "../types/ficha-empleado.types";
import { formatMarcacionHora } from "./ficha-empleado.utils";

/** Convierte las horas del horario a minutos desde medianoche */
function horaEnMinutos(hora: string): number {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}

/** Suma tramos cerrados de trabajo y deja fuera los descansos registrados */
export function getMinutosNetos(marcaciones: MarcacionEmpleado[], horario?: DiaHorarioDto): number | null {
  const ordenadas = [...marcaciones].sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime());
  let estado: "fuera" | "trabajo" | "descanso" = "fuera";
  let inicio = 0;
  let total = 0;
  let descansos = 0;
  let tramos = 0;

  for (const marca of ordenadas) {
    const momento = new Date(marca.fecha_hora).getTime();
    if (!Number.isFinite(momento)) return null;
    if (marca.tipo_marcacion === TipoMarcacion.ENTRADA) {
      // Una entrada repetida no abre otro tramo ni duplica las horas
      if (estado === "descanso") return null;
      if (estado === "fuera") { inicio = momento; estado = "trabajo"; }
    } else if (marca.tipo_marcacion === TipoMarcacion.SALIDA_ALMUERZO) {
      if (estado === "fuera") return null;
      if (estado === "trabajo") { total += momento - inicio; estado = "descanso"; }
    } else if (marca.tipo_marcacion === TipoMarcacion.ENTRADA_ALMUERZO) {
      if (estado === "fuera" || (estado === "trabajo" && descansos === 0)) return null;
      if (estado === "descanso") { inicio = momento; estado = "trabajo"; descansos++; }
    } else if (marca.tipo_marcacion === TipoMarcacion.SALIDA) {
      if (estado === "descanso" || (estado === "fuera" && tramos === 0)) return null;
      if (estado === "trabajo") { total += momento - inicio; estado = "fuera"; tramos++; }
    }
  }
  // Sin salida o con un descanso sin cerrar no se inventan horas trabajadas
  if (estado !== "fuera" || tramos === 0) return null;

  if (horario?.inicio_descanso && horario.fin_descanso && descansos === 0) {
    const entrada = ordenadas.find((item) => item.tipo_marcacion === TipoMarcacion.ENTRADA);
    const salida = ordenadas.findLast((item) => item.tipo_marcacion === TipoMarcacion.SALIDA);
    if (entrada && salida && horaEnMinutos(formatMarcacionHora(entrada.fecha_hora)) < horaEnMinutos(horario.inicio_descanso) && horaEnMinutos(formatMarcacionHora(salida.fecha_hora)) > horaEnMinutos(horario.fin_descanso)) return null;
  }
  return Math.floor(total / 60000);
}

/** Evalua el dia con el horario, periodo laboral y permisos aprobados */
export function getResultadoAsistenciaDia(
  dia: AsistenciaDia,
  jornada: JornadaEmpleado | null,
  empleado: PeriodoLaboralEmpleado,
  fechaReferencia: string,
  solicitudesAprobadas: SolicitudAsistenciaAprobada[] = [],
): ResultadoAsistenciaDia {
  const horario = jornada?.horario_semanal.find((item) => item.dia === dia.dia);
  const netos = dia.marcaciones.length ? getMinutosNetos(dia.marcaciones, horario) : null;
  const result = (estado: ResultadoAsistenciaDia["estado"], minutosNetos = netos, tardanza = 0): ResultadoAsistenciaDia => ({ estado, minutos_netos: minutosNetos, minutos_tardanza: tardanza });

  if ((empleado.fecha_inicio && dia.fecha < empleado.fecha_inicio.slice(0, 10)) || (empleado.fecha_cese && dia.fecha > empleado.fecha_cese.slice(0, 10))) return result("FUERA_PERIODO", null);
  if (!horario?.entrada) return result(horario && !horario.laborable ? "DESCANSO" : "SIN_JORNADA");
  if (!horario.laborable) return result("DESCANSO");
  if (dia.fecha > fechaReferencia) return result("PENDIENTE", null);

  const justificado = solicitudesAprobadas.some((solicitud) =>
    ["VACACIONES", "LICENCIA_MEDICA", "PERMISO", "JUSTIFICACION_ASISTENCIA"].includes(solicitud.tipo) && solicitud.fecha_inicio && solicitud.fecha_fin && dia.fecha >= solicitud.fecha_inicio.slice(0, 10) && dia.fecha <= solicitud.fecha_fin.slice(0, 10),
  );
  if (justificado) return result("JUSTIFICADO");

  const entradas = dia.marcaciones.filter((item) => item.tipo_marcacion === TipoMarcacion.ENTRADA);
  if (!entradas.length) return result(dia.fecha === fechaReferencia ? "PENDIENTE" : "FALTA", dia.marcaciones.length ? null : dia.fecha < fechaReferencia ? 0 : null);
  const primeraEntrada = Math.min(...entradas.map((item) => horaEnMinutos(formatMarcacionHora(item.fecha_hora))));
  const retraso = primeraEntrada - horaEnMinutos(horario.entrada);
  // Igual que el cierre del backend, la tolerancia no se resta al retraso
  const tardanza = retraso > (jornada?.tolerancia_minutos ?? 5) ? retraso : 0;
  return result(tardanza ? "TARDANZA" : "PUNTUAL", netos, tardanza);
}

/** Presenta horas y minutos sin confundir un dato pendiente con cero horas */
export function formatMinutosNetos(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
}
