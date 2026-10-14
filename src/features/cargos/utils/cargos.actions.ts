import { CrearCargoSchema, type CrearCargoDto } from "@jyp/shared-contracts";
import {
  AREAS_MOCK,
  CARGOS_MOCK,
} from "@/features/empleados/data/empleados.mock";
import { CARGOS_LISTADO_MOCK } from "../data/cargos.mock";

/** Guarda los cambios del formulario en los datos locales */
export function guardarCargoMock(values: CrearCargoDto, id?: string): void {
  const data = CrearCargoSchema.parse(values);
  const area = AREAS_MOCK.find((item) => item.id === data.id_area);
  if (!area) throw new Error("Selecciona un área disponible");
  if (
    CARGOS_LISTADO_MOCK.some(
      (item) =>
        item.id !== id &&
        item.activo &&
        item.id_area === data.id_area &&
        item.nombre.toLowerCase() === data.nombre.toLowerCase(),
    )
  )
    throw new Error("Ya existe ese cargo en el área");
  const index = CARGOS_LISTADO_MOCK.findIndex((item) => item.id === id);
  const next = {
    ...data,
    id: id ?? crypto.randomUUID(),
    area,
    activo: index < 0 ? true : CARGOS_LISTADO_MOCK[index].activo,
    total_empleados: index < 0 ? 0 : CARGOS_LISTADO_MOCK[index].total_empleados,
  };
  if (index < 0) CARGOS_LISTADO_MOCK.push(next);
  else CARGOS_LISTADO_MOCK[index] = next;
  const catalogIndex = CARGOS_MOCK.findIndex((item) => item.id === next.id);
  const catalog = { id: next.id, id_area: next.id_area, nombre: next.nombre };
  if (catalogIndex < 0) CARGOS_MOCK.push(catalog);
  else CARGOS_MOCK[catalogIndex] = catalog;
}

export function cambiarEstadoCargoMock(id: string): void {
  const index = CARGOS_LISTADO_MOCK.findIndex((item) => item.id === id);
  const actual = CARGOS_LISTADO_MOCK[index];
  if (!actual) throw new Error("El cargo no existe");
  if (actual.activo && actual.total_empleados > 0)
    throw new Error(
      "Reasigna a los empleados activos antes de desactivar el cargo",
    );
  CARGOS_LISTADO_MOCK[index] = { ...actual, activo: !actual.activo };
}
