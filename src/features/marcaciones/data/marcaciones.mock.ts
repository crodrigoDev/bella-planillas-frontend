import {
  marcarAsistenciaSchema,
  type MarcarAsistenciaDto,
} from "@jyp/shared-contracts";
import { MARCACIONES_EMPLEADO_MOCK } from "@/features/empleados/data/ficha-empleado.mock";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import type { MarcacionEmpleado } from "@/features/empleados/types/ficha-empleado.types";

export function getMarcacionesMock(): MarcacionEmpleado[] {
  return [...MARCACIONES_EMPLEADO_MOCK].sort((a, b) =>
    b.fecha_hora.localeCompare(a.fecha_hora),
  );
}

/** Agrega una marca manual sin duplicar empleado, hora y tipo */
export function crearMarcacionMock(values: MarcarAsistenciaDto): void {
  const data = marcarAsistenciaSchema.parse(values);
  const emp = EMPLEADOS_MOCK.find(
    (item) =>
      item.nro_documento === data.nro_documento &&
      item.activo &&
      !item.deleted_at,
  );
  if (!emp) throw new Error("El empleado no existe o está inactivo");
  const fecha = data.fecha_hora.toISOString();
  if (
    MARCACIONES_EMPLEADO_MOCK.some(
      (item) =>
        item.empleado_id === emp.id &&
        item.fecha_hora === fecha &&
        item.tipo_marcacion === data.tipo_marcacion,
    )
  )
    throw new Error("Ya existe esa marcación para el empleado");
  MARCACIONES_EMPLEADO_MOCK.push({
    ...data,
    fecha_hora: fecha,
    id: crypto.randomUUID(),
    empleado_id: emp.id,
    colaborador: getEmpleadoNombre(emp),
    metodo: "MANUAL",
  });
}

export function fechaMarcacionLima(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
