import { DiaSemanaEnum, TipoMarcacion } from "@jyp/shared-contracts";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getJornadaEmpleadoMock } from "@/features/empleados/data/jornadas-empleado.mock";
import { FICHA_FECHA_MOCK } from "@/features/empleados/config/ficha-empleado.config";
import { getResultadoAsistenciaDia } from "@/features/empleados/utils/asistencia-diaria.utils";
import {
  addFichaDays,
  getMarcacionFecha,
} from "@/features/empleados/utils/ficha-empleado.utils";
import type { MarcacionEmpleado } from "@/features/empleados/types/ficha-empleado.types";
import { SOLICITUDES_MOCK } from "@/features/solicitudes/data/solicitudes.mock";
import type {
  AsistenciaRegistro,
  EstadoAsistenciaRegistro,
} from "../types/asistencia-diaria.types";

/** Agrupa los registros reales del mock y usa el mismo calculo de la ficha */
export function getAsistenciasDiarias(
  marcaciones: MarcacionEmpleado[],
  inicio: string,
  fin: string,
): AsistenciaRegistro[] {
  const validDate = (fecha: string): boolean => {
    const date = new Date(`${fecha}T12:00:00Z`);
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === fecha
    );
  };
  if (!validDate(inicio) || !validDate(fin) || inicio > fin) return [];
  const rows: AsistenciaRegistro[] = [];
  const empleados = EMPLEADOS_MOCK.filter((item) => !item.deleted_at);
  for (let fecha = inicio; fecha <= fin; fecha = addFichaDays(fecha, 1)) {
    const dia =
      DiaSemanaEnum.options[
        (new Date(`${fecha}T12:00:00Z`).getUTCDay() + 6) % 7
      ];
    for (const empleado of empleados) {
      const jornada = getJornadaEmpleadoMock(empleado.jornada_id);
      const horario = jornada?.horario_semanal.find((item) => item.dia === dia);
      const registros = marcaciones
        .filter(
          (item) =>
            item.empleado_id === empleado.id &&
            getMarcacionFecha(item.fecha_hora) === fecha,
        )
        .sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora));
      const solicitudes = SOLICITUDES_MOCK.filter(
        (item) =>
          item.empleado_id === empleado.id && item.estado === "APROBADA",
      );
      const resultado = getResultadoAsistenciaDia(
        { fecha, dia, marcaciones: registros },
        jornada,
        empleado,
        FICHA_FECHA_MOCK,
        solicitudes,
      );
      let estado: EstadoAsistenciaRegistro = resultado.estado;
      // Una entrada sin cierre no se muestra como una asistencia completa
      if (
        (estado === "PUNTUAL" || estado === "TARDANZA") &&
        resultado.minutos_netos === null
      ) {
        const tieneSalida = registros.some(
          (item) => item.tipo_marcacion === TipoMarcacion.SALIDA,
        );
        estado =
          fecha === FICHA_FECHA_MOCK && !tieneSalida
            ? "EN_CURSO"
            : "INCOMPLETA";
      }
      rows.push({
        id: `${empleado.id}-${fecha}`,
        fecha,
        dia,
        empleado,
        jornada,
        horario,
        marcaciones: registros,
        resultado: { ...resultado, estado },
      });
    }
    if (fecha === fin) break;
  }
  return rows;
}
