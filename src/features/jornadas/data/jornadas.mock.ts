import {
  CrearJornadaSchema,
  type CrearJornadaDto,
} from "@jyp/shared-contracts";
import {
  AREAS_MOCK,
  EMPLEADOS_MOCK,
  JORNADAS_MOCK,
} from "@/features/empleados/data/empleados.mock";
import { JORNADAS_EMPLEADO_MOCK } from "@/features/empleados/data/jornadas-empleado.mock";
import type { JornadaListado } from "../types/jornadas.types";

const jornadas: JornadaListado[] = JORNADAS_EMPLEADO_MOCK.map((item) => ({
  ...item,
  areas_ids: AREAS_MOCK.map((area) => area.id),
  areas: [...AREAS_MOCK],
  total_areas: AREAS_MOCK.length,
  total_empleados: 0,
}));

export function getJornadasMock(): JornadaListado[] {
  return jornadas.map((jornada) => ({
    ...jornada,
    total_empleados: EMPLEADOS_MOCK.filter(
      (emp) => emp.activo && !emp.deleted_at && emp.jornada_id === jornada.id,
    ).length,
  }));
}

/** Calcula las horas del horario y conserva el detalle utilizado por la ficha */
export function guardarJornadaMock(values: CrearJornadaDto, id?: string): void {
  const data = CrearJornadaSchema.parse(values);
  if (
    jornadas.some(
      (item) =>
        item.id !== id &&
        item.activo &&
        item.nombre.toLowerCase() === data.nombre.trim().toLowerCase(),
    )
  )
    throw new Error("Ya existe una jornada con ese nombre");
  const horario = data.horario_semanal.map((dia) => {
    if (!dia.laborable || !dia.entrada || !dia.salida)
      return { ...dia, total_horas: 0 };
    const minutes = (hora: string): number =>
      Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5));
    const tramo = (inicio: string, fin: string): number => {
      const delta = minutes(fin) - minutes(inicio);
      return delta <= 0 ? delta + 1440 : delta;
    };
    const descanso =
      dia.inicio_descanso && dia.fin_descanso
        ? tramo(dia.inicio_descanso, dia.fin_descanso)
        : 0;
    return {
      ...dia,
      total_horas: Math.max(
        0,
        Number(((tramo(dia.entrada, dia.salida) - descanso) / 60).toFixed(2)),
      ),
    };
  });
  const total = Number(
    horario.reduce((sum, dia) => sum + dia.total_horas, 0).toFixed(2),
  );
  if (total > 48 || (data.duracion === "TIEMPO_PARCIAL" && total >= 30))
    throw new Error(
      "La jornada admite hasta 48 horas semanales; tiempo parcial debe ser menor a 30 horas",
    );
  const areas = AREAS_MOCK.filter((area) => data.areas_ids.includes(area.id));
  if (areas.length !== data.areas_ids.length)
    throw new Error("Selecciona áreas disponibles");
  const next: JornadaListado = {
    ...data,
    horario_semanal: horario,
    id: id ?? crypto.randomUUID(),
    total_horas_semana: total,
    areas,
    total_areas: areas.length,
    total_empleados: 0,
  };
  const index = jornadas.findIndex((item) => item.id === id);
  if (index < 0) jornadas.push(next);
  else jornadas[index] = next;
  const detailIndex = JORNADAS_EMPLEADO_MOCK.findIndex(
    (item) => item.id === next.id,
  );
  if (detailIndex < 0) JORNADAS_EMPLEADO_MOCK.push(next);
  else JORNADAS_EMPLEADO_MOCK[detailIndex] = next;
  const catalog = { id: next.id, nombre: next.nombre, turno: next.turno };
  const catalogIndex = JORNADAS_MOCK.findIndex((item) => item.id === next.id);
  if (catalogIndex < 0) JORNADAS_MOCK.push(catalog);
  else JORNADAS_MOCK[catalogIndex] = catalog;
}

export function cambiarEstadoJornadaMock(id: string): void {
  const actual = getJornadasMock().find((item) => item.id === id);
  if (!actual) throw new Error("La jornada no existe");
  if (actual.activo && actual.total_empleados > 0)
    throw new Error(
      "Reasigna los empleados activos antes de desactivar la jornada",
    );
  guardarJornadaMock({ ...actual, activo: !actual.activo }, id);
}
