import { CrearContratoSchema, EditarContratoSchema, RenovarContratoSchema, type CrearContratoDto, type EditarContratoDto, type RenovarContratoDto } from "@jyp/shared-contracts";
import { EMPLEADOS_MOCK } from "./empleados.mock";
import { CONTRATOS_FICHA_MOCK, getContratosMock } from "./ficha-empleado.mock";
import { CONTRATOS_REGISTRADOS_MOCK } from "./registro-empleado.mock";
import type { ContratoMock } from "../types/contrato-empleado.types";

/** Verifica que el empleado siga disponible para crear o renovar */
function validarEmpleadoActivo(empleadoId: string): void {
  const empleado = EMPLEADOS_MOCK.find((item) => item.id === empleadoId);
  if (!empleado?.activo || empleado.deleted_at) throw new Error("No se puede registrar un contrato para un empleado dado de baja");
}

function buscarContrato(id: string): ContratoMock {
  const contrato = getContratosMock().find((item) => item.id === id && !item.deleted_at);
  if (!contrato) throw new Error("El contrato no existe o ya fue anulado");
  return contrato;
}

function guardarContrato(contrato: ContratoMock): ContratoMock {
  const records = CONTRATOS_FICHA_MOCK.some((item) => item.id === contrato.id) ? CONTRATOS_FICHA_MOCK : CONTRATOS_REGISTRADOS_MOCK;
  const index = records.findIndex((item) => item.id === contrato.id);
  if (index >= 0) records[index] = contrato;
  else records.push(contrato);
  return contrato;
}

/** Comprueba el orden de las fechas antes de cambiar los datos de prueba */
function validarFechas(inicio: string, fin?: string | null): void {
  if (fin && inicio > fin) throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
}

/** Agrega un contrato sin modificar los anteriores */
export function crearContratoEmpleadoMock(values: CrearContratoDto): ContratoMock {
  const data = CrearContratoSchema.parse(values);
  validarEmpleadoActivo(data.empleado_id);
  validarFechas(data.fecha_inicio, data.fecha_fin);
  return guardarContrato({ ...data, id: crypto.randomUUID(), url: null, deleted_at: null });
}

/** Edita los campos permitidos mientras no exista un PDF adjunto */
export function editarContratoEmpleadoMock(id: string, values: EditarContratoDto): ContratoMock {
  const actual = buscarContrato(id);
  if (actual.url) throw new Error("El contrato ya tiene un PDF adjunto y no se puede editar");
  const { contrato_origen_id: origenIgnorado, ...data } = EditarContratoSchema.parse(values);
  void origenIgnorado;
  // En este endpoint null conserva la observacion y una cadena vacia la borra
  const cambios = Object.fromEntries(Object.entries({ ...data, observacion: data.observacion === null ? undefined : data.observacion }).filter(([, value]) => value !== undefined));
  const next = { ...actual, ...cambios };
  validarFechas(next.fecha_inicio, next.fecha_fin);
  return guardarContrato(next);
}

/** Conserva el anterior como Renovado y enlaza el nuevo contrato vigente */
export function renovarContratoEmpleadoMock(id: string, values: RenovarContratoDto): ContratoMock {
  const actual = buscarContrato(id);
  validarEmpleadoActivo(actual.empleado_id);
  if (actual.estado === "RENOVADO") throw new Error("Este contrato ya fue renovado previamente");
  const data = RenovarContratoSchema.parse(values);
  validarFechas(data.fecha_inicio, data.fecha_fin);
  const next = CrearContratoSchema.parse({ ...data, empleado_id: actual.empleado_id, tipo_modalidad: data.tipo_modalidad || actual.tipo_modalidad, estado: "VIGENTE", contrato_origen_id: id, observacion: data.observacion ?? `Prórroga del contrato anterior (${id})` });
  // Todas las comprobaciones terminan antes de cambiar cualquiera de los dos registros
  guardarContrato({ ...actual, estado: "RENOVADO" });
  return guardarContrato({ ...next, id: crypto.randomUUID(), url: null, deleted_at: null });
}

/** Marca el contrato como anulado y lo retira del listado */
export function anularContratoEmpleadoMock(id: string): void {
  const actual = buscarContrato(id);
  if (actual.estado === "ANULADO") throw new Error("El contrato ya se encuentra anulado");
  guardarContrato({ ...actual, estado: "ANULADO", deleted_at: new Date().toISOString() });
}
