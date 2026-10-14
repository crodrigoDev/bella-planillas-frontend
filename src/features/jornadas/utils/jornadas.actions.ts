import type { CrearJornadaDto } from "@jyp/shared-contracts";
import {
  AREAS_MOCK,
  JORNADAS_MOCK,
} from "@/features/empleados/data/empleados.mock";
import { JORNADAS_EMPLEADO_MOCK } from "@/features/empleados/data/jornadas-empleado.mock";
import { JORNADAS_LISTADO_MOCK } from "../data/jornadas.mock";
import { prepararJornada } from "./jornada-form.utils";

/** Guarda el formulario en memoria para verlo al volver al listado */
export function guardarJornadaMock(values: CrearJornadaDto, id?: string): void {
  const data = prepararJornada(values);
  if (
    JORNADAS_LISTADO_MOCK.some(
      (item) =>
        item.id !== id &&
        item.activo &&
        item.nombre.toLowerCase() === data.nombre.toLowerCase(),
    )
  )
    throw new Error("Ya existe una jornada con ese nombre");
  const index = JORNADAS_LISTADO_MOCK.findIndex((item) => item.id === id);
  const areas = AREAS_MOCK.filter((area) => data.areas_ids.includes(area.id));
  const next = {
    ...data,
    id: id ?? crypto.randomUUID(),
    areas,
    total_areas: areas.length,
    total_empleados:
      index < 0 ? 0 : JORNADAS_LISTADO_MOCK[index].total_empleados,
    total_horas_semana: Number(
      data.horario_semanal
        .reduce((sum, dia) => sum + dia.total_horas, 0)
        .toFixed(2),
    ),
  };
  if (index < 0) JORNADAS_LISTADO_MOCK.push(next);
  else JORNADAS_LISTADO_MOCK[index] = next;
  // Mantiene disponibles las nuevas jornadas para el formulario de empleados
  const catalogIndex = JORNADAS_MOCK.findIndex((item) => item.id === next.id);
  const catalog = { id: next.id, nombre: next.nombre, turno: next.turno };
  if (catalogIndex < 0) JORNADAS_MOCK.push(catalog);
  else JORNADAS_MOCK[catalogIndex] = catalog;
  const fichaIndex = JORNADAS_EMPLEADO_MOCK.findIndex(
    (item) => item.id === next.id,
  );
  if (fichaIndex < 0) JORNADAS_EMPLEADO_MOCK.push(next);
  else JORNADAS_EMPLEADO_MOCK[fichaIndex] = next;
}

export function cambiarEstadoJornadaMock(id: string): void {
  const index = JORNADAS_LISTADO_MOCK.findIndex((item) => item.id === id);
  const actual = JORNADAS_LISTADO_MOCK[index];
  if (!actual) throw new Error("La jornada no existe");
  if (actual.activo && actual.total_empleados > 0)
    throw new Error(
      "Reasigna los empleados activos antes de desactivar la jornada",
    );
  JORNADAS_LISTADO_MOCK[index] = { ...actual, activo: !actual.activo };
}
