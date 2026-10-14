import { CrearJornadaSchema, DiaSemanaEnum, type CrearJornadaDto } from "@jyp/shared-contracts";
import { AREAS_MOCK, JORNADAS_MOCK } from "./empleados.mock";
import type { JornadaEmpleado } from "../types/ficha-empleado.types";

/** Prepara siete dias con horarios validos para cada jornada de prueba */
function crearHorarioMock(index: number): CrearJornadaDto["horario_semanal"] {
  const parcial = index === 1;
  const rotativa = index === 2;
  return DiaSemanaEnum.options.map((dia, dayIndex) => {
    const laborable = dayIndex < (rotativa ? 6 : 5);
    return {
      dia,
      laborable,
      modalidad: "PRESENCIAL",
      entrada: laborable ? (parcial ? "14:00" : "08:00") : null,
      inicio_descanso: laborable && !parcial ? "13:00" : null,
      fin_descanso: laborable && !parcial ? "14:00" : null,
      salida: laborable ? (parcial ? "18:00" : "17:00") : null,
      total_horas: laborable ? (parcial ? 4 : 8) : 0,
    };
  });
}

// Reutiliza los IDs del listado y agrega el detalle que devuelve Jornadas
export const JORNADAS_EMPLEADO_MOCK: JornadaEmpleado[] = JORNADAS_MOCK.map((catalogo, index) => {
  const { areas_ids: areasIds, ...data } = CrearJornadaSchema.parse({
    nombre: catalogo.nombre,
    descripcion: index === 2 ? "Horario base de la jornada rotativa" : "Horario semanal del colaborador",
    duracion: index === 1 ? "TIEMPO_PARCIAL" : "TIEMPO_COMPLETO",
    turno: catalogo.turno,
    modalidad: "PRESENCIAL",
    tolerancia_minutos: 5,
    areas_ids: AREAS_MOCK.map((item) => item.id),
    horario_semanal: crearHorarioMock(index),
    patron_rotacion: index === 2 ? { tipo_ciclo: "6x1", dias_trabajo: 6, dias_descanso: 1, frecuencia_cambio: "SEMANAL", turnos_base: ["MANANA", "TARDE"] } : null,
    activo: true,
  });
  void areasIds;
  return { ...data, id: catalogo.id, total_horas_semana: data.horario_semanal.reduce((total, dia) => total + dia.total_horas, 0) };
});

/** Obtiene el detalle por la jornada asignada al empleado */
export function getJornadaEmpleadoMock(jornadaId: string | null): JornadaEmpleado | null {
  return JORNADAS_EMPLEADO_MOCK.find((item) => item.id === jornadaId) ?? null;
}
