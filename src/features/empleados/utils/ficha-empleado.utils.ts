import { DiaSemanaEnum } from "@jyp/shared-contracts";
import { FICHA_FECHA_MOCK } from "../config/ficha-empleado.config";
import type { AsistenciaDia, MarcacionEmpleado } from "../types/ficha-empleado.types";

const fechaPeru = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" });
const horaPeru = new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** Mueve una fecha sin desplazar el dia por la zona horaria */
export function addFichaDays(fecha: string, cantidad: number): string {
  const date = new Date(`${fecha}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + cantidad);
  return date.toISOString().slice(0, 10);
}

/** Obtiene el lunes de una fecha valida o de la semana de prueba */
export function getFichaSemana(value?: string | null): string {
  const date = new Date(`${value}T12:00:00Z`);
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  const fecha = valid && value ? value : FICHA_FECHA_MOCK;
  const dia = new Date(`${fecha}T12:00:00Z`).getUTCDay();
  return addFichaDays(fecha, -((dia + 6) % 7));
}

/** Usa el dia de Peru para agrupar incluso las marcaciones cercanas a medianoche */
export function getMarcacionFecha(fechaHora: string): string {
  return fechaPeru.format(new Date(fechaHora));
}

export function formatMarcacionHora(fechaHora: string): string {
  return horaPeru.format(new Date(fechaHora));
}

/** Agrupa las marcaciones de lunes a domingo y conserva todos los registros */
export function getAsistenciaSemana(semana: string, marcaciones: MarcacionEmpleado[]): AsistenciaDia[] {
  return DiaSemanaEnum.options.map((dia, index) => {
    const fecha = addFichaDays(semana, index);
    return {
      dia,
      fecha,
      marcaciones: marcaciones.filter((item) => getMarcacionFecha(item.fecha_hora) === fecha)
        .sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora)),
    };
  });
}

/** Presenta las modalidades del contrato sin alterar el valor recibido */
export function formatContratoModalidad(value: string): string {
  const labels: Record<string, string> = { PLAZO_FIJO: "Plazo fijo", INDETERMINADO: "Indeterminado" };
  return labels[value] ?? value;
}
