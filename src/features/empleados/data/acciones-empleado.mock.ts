import {
  CrearEmpleadoSchema,
  CambiarEstadoLaboralSchema,
  EditarEmpleadoSchema,
  type CambiarEstadoLaboralDto,
  type CrearEmpleadoDto,
  type EditarEmpleadoDto,
} from "@jyp/shared-contracts";
import {
  AREAS_MOCK,
  CARGOS_MOCK,
  DOCUMENTOS_MOCK,
  EMPLEADOS_MOCK,
  JORNADAS_MOCK,
} from "./empleados.mock";
import type { EmpleadoMock } from "../types/empleados.types";

/** Agrega los datos del formulario al arreglo local */
export function registrarEmpleadoMock(values: CrearEmpleadoDto): EmpleadoMock {
  const data = CrearEmpleadoSchema.parse(values);
  if (EMPLEADOS_MOCK.some((item) => item.nro_documento === data.nro_documento))
    throw new Error("Ya existe un empleado con este número de documento");
  const area = AREAS_MOCK.find((item) => item.id === data.area_id);
  const cargo = CARGOS_MOCK.find((item) => item.id === data.cargo_id);
  const documento = DOCUMENTOS_MOCK.find(
    (item) => item.id === data.documento_id,
  );
  const jornada =
    JORNADAS_MOCK.find((item) => item.id === data.jornada_id) ?? null;
  if (!area || !cargo || !documento || (data.jornada_id && !jornada))
    throw new Error(
      "Selecciona los datos laborales y el documento de los catálogos disponibles",
    );
  const empleado: EmpleadoMock = {
    ...data,
    id: crypto.randomUUID(),
    nombre: data.nombre ?? null,
    apellido: data.apellido ?? null,
    email: data.email ?? null,
    fecha_inicio: data.fecha_inicio ?? null,
    jornada_id: data.jornada_id ?? null,
    area,
    cargo,
    jornada,
    estado_laboral: "ACTIVO",
    activo: true,
    dato_financiero: null,
  };
  EMPLEADOS_MOCK.push(empleado);
  EMPLEADOS_MOCK.sort((a, b) =>
    (a.apellido ?? "").localeCompare(b.apellido ?? "", "es-PE"),
  );
  return empleado;
}

/** Busca un registro disponible para las acciones de personal */
function getEmpleadoActivoMock(id: string): EmpleadoMock {
  const empleado = EMPLEADOS_MOCK.find((item) => item.id === id);
  if (!empleado || !empleado.activo || empleado.deleted_at) {
    throw new Error("El empleado no existe o ya fue dado de baja");
  }
  return empleado;
}

/** Reemplaza la fila para que la tabla pueda mostrar los nuevos valores */
function guardarEmpleadoMock(empleado: EmpleadoMock): EmpleadoMock {
  const index = EMPLEADOS_MOCK.findIndex((item) => item.id === empleado.id);
  EMPLEADOS_MOCK[index] = empleado;
  EMPLEADOS_MOCK.sort((a, b) =>
    (a.apellido ?? "").localeCompare(b.apellido ?? "", "es-PE"),
  );
  return empleado;
}

/** Guarda solo los campos enviados y conserva contratos y datos financieros */
export function editarEmpleadoMock(
  id: string,
  values: EditarEmpleadoDto,
): EmpleadoMock {
  const actual = getEmpleadoActivoMock(id);
  const data = EditarEmpleadoSchema.parse(values);
  if (
    data.nro_documento &&
    EMPLEADOS_MOCK.some(
      (item) => item.id !== id && item.nro_documento === data.nro_documento,
    )
  ) {
    throw new Error("Ya existe un empleado con este número de documento");
  }
  const area = AREAS_MOCK.find(
    (item) => item.id === (data.area_id ?? actual.area_id),
  );
  const cargo = CARGOS_MOCK.find(
    (item) => item.id === (data.cargo_id ?? actual.cargo_id),
  );
  const documentoId = data.documento_id ?? actual.documento_id;
  const jornadaId =
    data.jornada_id === undefined ? actual.jornada_id : data.jornada_id;
  const jornada = JORNADAS_MOCK.find((item) => item.id === jornadaId) ?? null;
  if (
    !area ||
    !cargo ||
    !DOCUMENTOS_MOCK.some((item) => item.id === documentoId) ||
    (jornadaId && !jornada)
  ) {
    throw new Error(
      "Selecciona los datos laborales y el documento de los catálogos disponibles",
    );
  }
  // undefined conserva el dato anterior y null permite borrar un campo opcional
  const cambios = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
  return guardarEmpleadoMock({
    ...actual,
    ...cambios,
    area_id: area.id,
    cargo_id: cargo.id,
    area,
    cargo,
    jornada_id: jornadaId,
    jornada,
    // El endpoint actual vuelve a Activo al guardar cualquier edicion
    estado_laboral: "ACTIVO",
  });
}

/** Cambia el estado operativo sin desactivar el registro */
export function cambiarEstadoLaboralMock(
  id: string,
  values: CambiarEstadoLaboralDto,
): EmpleadoMock {
  const actual = getEmpleadoActivoMock(id);
  const data = CambiarEstadoLaboralSchema.parse(values);
  if (actual.estado_laboral === data.estado_laboral) {
    throw new Error("El empleado ya tiene ese estado laboral");
  }
  // El backend recibe motivo pero actualmente solo guarda el estado
  return guardarEmpleadoMock({
    ...actual,
    estado_laboral: data.estado_laboral,
  });
}

/** Simula la baja formal con la fecha actual que usa el endpoint */
export function desactivarEmpleadoMock(id: string): EmpleadoMock {
  const actual = getEmpleadoActivoMock(id);
  const fecha = new Date().toISOString();
  return guardarEmpleadoMock({
    ...actual,
    activo: false,
    estado_laboral: "CESADO",
    fecha_cese: fecha,
    deleted_at: fecha,
  });
}
