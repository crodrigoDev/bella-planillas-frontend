import { CrearCargoSchema, type CrearCargoDto } from "@jyp/shared-contracts";
import {
  AREAS_MOCK,
  CARGOS_MOCK,
  EMPLEADOS_MOCK,
} from "@/features/empleados/data/empleados.mock";
import type { CargoListado } from "../types/cargos.types";

const cargos: CargoListado[] = CARGOS_MOCK.map((cargo, index) => ({
  ...cargo,
  descripcion: "Funciones y responsabilidades del puesto",
  sueldo_minimo: 1500 + index * 350,
  sueldo_maximo: 3000 + index * 650,
  area: AREAS_MOCK.find((area) => area.id === cargo.id_area)!,
  activo: true,
  total_empleados: 0,
}));

export function getCargosMock(): CargoListado[] {
  return cargos.map((cargo) => ({
    ...cargo,
    total_empleados: EMPLEADOS_MOCK.filter(
      (emp) => emp.activo && !emp.deleted_at && emp.cargo_id === cargo.id,
    ).length,
  }));
}

/** Valida el formulario y actualiza tambien las opciones del registro de empleados */
export function guardarCargoMock(values: CrearCargoDto, id?: string): void {
  const data = CrearCargoSchema.parse(values);
  const area = AREAS_MOCK.find((item) => item.id === data.id_area);
  if (!area) throw new Error("Selecciona un área disponible");
  if (
    cargos.some(
      (cargo) =>
        cargo.id !== id &&
        cargo.activo &&
        cargo.id_area === data.id_area &&
        cargo.nombre.toLowerCase() === data.nombre.toLowerCase(),
    )
  )
    throw new Error("Ya existe ese cargo en el área");
  const next = {
    ...data,
    id: id ?? crypto.randomUUID(),
    area,
    activo: true,
    total_empleados: 0,
  };
  const index = cargos.findIndex((cargo) => cargo.id === id);
  if (index < 0) cargos.push(next);
  else cargos[index] = { ...next, activo: cargos[index].activo };
  const catalogIndex = CARGOS_MOCK.findIndex((cargo) => cargo.id === next.id);
  const catalog = { id: next.id, id_area: next.id_area, nombre: next.nombre };
  if (catalogIndex < 0) CARGOS_MOCK.push(catalog);
  else CARGOS_MOCK[catalogIndex] = catalog;
}

/** Bloquea la baja cuando el cargo tiene empleados activos */
export function cambiarEstadoCargoMock(id: string): void {
  const index = cargos.findIndex((cargo) => cargo.id === id);
  if (index < 0) throw new Error("El cargo no existe");
  const actual = getCargosMock()[index];
  if (actual.activo && actual.total_empleados > 0)
    throw new Error(
      "Reasigna a los empleados activos antes de desactivar el cargo",
    );
  cargos[index] = { ...actual, activo: !actual.activo };
}
