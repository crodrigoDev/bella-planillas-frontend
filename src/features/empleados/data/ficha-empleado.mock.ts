import { CrearContratoSchema, TipoMarcacion, marcarAsistenciaSchema } from "@jyp/shared-contracts";
import { EMPLEADOS_MOCK } from "./empleados.mock";
import { CONTRATOS_REGISTRADOS_MOCK } from "./registro-empleado.mock";
import { getJornadaEmpleadoMock } from "./jornadas-empleado.mock";
import { FICHA_FECHA_MOCK } from "../config/ficha-empleado.config";
import { addFichaDays, getFichaSemana } from "../utils/ficha-empleado.utils";
import { getEmpleadoNombre } from "../utils/empleados.utils";
import type { ContratoEmpleado, MarcacionEmpleado } from "../types/ficha-empleado.types";
import type { ContratoMock } from "../types/contrato-empleado.types";

// Los contratos de ejemplo no modifican los registros creados con el formulario
export const CONTRATOS_FICHA_MOCK: ContratoMock[] = EMPLEADOS_MOCK.flatMap((empleado, index) => {
  if (!empleado.activo || index % 7 === 3) return [];
  const anteriorId = `90000000-0000-4000-8000-${String(index * 2 + 1).padStart(12, "0")}`;
  const actualId = `90000000-0000-4000-8000-${String(index * 2 + 2).padStart(12, "0")}`;
  const anterior = CrearContratoSchema.parse({ empleado_id: empleado.id, tipo_modalidad: "PLAZO_FIJO", fecha_inicio: "2025-10-05", fecha_fin: "2026-03-31", estado: "RENOVADO", observacion: "Contrato anterior del colaborador" });
  const actual = CrearContratoSchema.parse({ empleado_id: empleado.id, tipo_modalidad: index % 3 === 0 ? "INDETERMINADO" : "PLAZO_FIJO", fecha_inicio: "2026-04-01", fecha_fin: index % 3 === 0 ? null : index % 3 === 1 ? "2026-10-26" : "2027-03-31", contrato_origen_id: anteriorId, estado: "VIGENTE", observacion: "Condiciones acordadas para el periodo vigente" });
  return [{ ...actual, id: actualId }, { ...anterior, id: anteriorId }];
});

/** Reune los contratos de ejemplo y los registrados durante esta visita */
export function getContratosMock(): ContratoMock[] {
  return [...CONTRATOS_FICHA_MOCK, ...CONTRATOS_REGISTRADOS_MOCK];
}

/** Entrega el historial con los mismos datos de vencimiento del listado */
export function getContratosEmpleadoMock(empleadoId: string, records = getContratosMock()): ContratoEmpleado[] {
  const referencia = new Date(`${FICHA_FECHA_MOCK}T12:00:00-05:00`).getTime();
  return records
    .filter((item) => item.empleado_id === empleadoId && !item.deleted_at)
    .sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio))
    .map((item) => {
      const dias = item.fecha_fin ? Math.trunc((new Date(item.fecha_fin).getTime() - referencia) / 86400000) : null;
      return { ...item, dias_restantes: dias, alerta_vencimiento: dias === null ? null : dias < 0 ? "VENCIDO" : dias <= 15 ? "CRITICO" : dias <= 30 ? "PREVENTIVO" : "REGULAR", es_prorroga: Boolean(item.contrato_origen_id), tiene_archivo: Boolean(item.url), url_documento: item.url ?? null };
    });
}

// Marcaciones locales con dias puntuales, tardanzas y dias sin entrada
export const MARCACIONES_EMPLEADO_MOCK: MarcacionEmpleado[] = EMPLEADOS_MOCK.flatMap((empleado, index) => {
  const jornada = getJornadaEmpleadoMock(empleado.jornada_id);
  if (!empleado.activo || !jornada) return [];
  const lunes = getFichaSemana(FICHA_FECHA_MOCK);
  return Array.from({ length: 21 }, (_, dayIndex) => {
    const fecha = addFichaDays(lunes, dayIndex - 14);
    const horario = jornada.horario_semanal[dayIndex % 7];
    if (fecha > FICHA_FECHA_MOCK || !horario.laborable || (index + dayIndex) % 11 === 0 || (dayIndex % 7 === 2 && fecha < FICHA_FECHA_MOCK) || (fecha === lunes && index % 4 === 0)) return [];
    const horas = [
      { tipo: TipoMarcacion.ENTRADA, hora: horario.entrada },
      { tipo: TipoMarcacion.SALIDA_ALMUERZO, hora: horario.inicio_descanso },
      { tipo: TipoMarcacion.ENTRADA_ALMUERZO, hora: horario.fin_descanso },
      { tipo: TipoMarcacion.SALIDA, hora: horario.salida },
    ];
    return horas.flatMap(({ tipo, hora }) => {
      // Algunos dias solo tienen entrada para revisar marcaciones incompletas
      if (!hora || (fecha === FICHA_FECHA_MOCK && tipo !== TipoMarcacion.ENTRADA)) return [];
      const fechaHora = new Date(`${fecha}T${hora}:00-05:00`);
      // Los martes tienen doce minutos de retraso para revisar la variante Tardanza
      if (tipo === TipoMarcacion.ENTRADA && dayIndex % 7 === 1) fechaHora.setMinutes(fechaHora.getMinutes() + 12);
      const data = marcarAsistenciaSchema.parse({ nro_documento: empleado.nro_documento, fecha_hora: fechaHora, tipo_marcacion: tipo });
      return [{ ...data, id: crypto.randomUUID(), empleado_id: empleado.id, colaborador: getEmpleadoNombre(empleado), fecha_hora: data.fecha_hora.toISOString(), metodo: "MANUAL" }];
    });
  }).flat();
});

/** Conserva el filtro por empleado y rango de fechas que usara la consulta */
export function getMarcacionesEmpleadoMock(empleadoId: string, inicio: string, fin: string): MarcacionEmpleado[] {
  const desde = new Date(`${inicio}T00:00:00-05:00`).getTime();
  const hasta = new Date(`${fin}T23:59:59.999-05:00`).getTime();
  return MARCACIONES_EMPLEADO_MOCK.filter((item) => item.empleado_id === empleadoId && new Date(item.fecha_hora).getTime() >= desde && new Date(item.fecha_hora).getTime() <= hasta);
}
