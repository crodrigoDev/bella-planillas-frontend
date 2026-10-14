import {
  CrearJornadaSchema,
  type CrearJornadaDto,
} from "@jyp/shared-contracts";
import type { JornadaFormValues } from "../types/jornadas.types";

/** Calcula el tramo de trabajo descontando el descanso, incluso si cruza medianoche */
export function getJornadaHorasDia(
  dia: JornadaFormValues["horario_semanal"][number],
): number {
  if (!dia.laborable || !dia.entrada || !dia.salida) return 0;
  const minutos = (hora: string): number =>
    Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5));
  const tramo = (inicio: string, fin: string): number => {
    const diferencia = minutos(fin) - minutos(inicio);
    return diferencia <= 0 ? diferencia + 1440 : diferencia;
  };
  const descanso =
    dia.inicio_descanso && dia.fin_descanso
      ? tramo(dia.inicio_descanso, dia.fin_descanso)
      : 0;
  return Math.max(
    0,
    Number(((tramo(dia.entrada, dia.salida) - descanso) / 60).toFixed(2)),
  );
}

/** Prepara los mismos campos del contrato y comprueba el limite semanal */
export function prepararJornada(values: JornadaFormValues): CrearJornadaDto {
  const horario = values.horario_semanal.map((dia) => ({
    ...dia,
    total_horas: getJornadaHorasDia(dia),
  }));
  const total = horario.reduce((sum, dia) => sum + dia.total_horas, 0);
  if (total > 48)
    throw new Error("El horario no puede superar las 48 horas semanales");
  if (values.duracion === "TIEMPO_PARCIAL" && total >= 30)
    throw new Error("Tiempo parcial debe sumar menos de 30 horas semanales");
  return CrearJornadaSchema.parse({
    ...values,
    nombre: values.nombre.trim(),
    horario_semanal: horario,
  });
}
