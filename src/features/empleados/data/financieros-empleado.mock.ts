import { ActualizarDatoFinancieroSchema, CrearDatoFinancieroSchema, type ActualizarDatoFinancieroDto, type CrearDatoFinancieroDto } from "@jyp/shared-contracts";
import { EMPLEADOS_MOCK } from "./empleados.mock";
import { AFPS_MOCK, BANCOS_MOCK, FINANCIEROS_REGISTRADOS_MOCK, REGIMENES_PENSION_MOCK } from "./registro-empleado.mock";
import type { FinancieroEmpleado, FinancieroMock } from "../types/financiero-empleado.types";

// Solo sirve para simular la confirmacion en esta vista sin backend
export const PASSWORD_FINANCIERO_MOCK = "demo123";

const FINANCIEROS_FICHA_MOCK: FinancieroMock[] = EMPLEADOS_MOCK.flatMap((empleado, index) => {
  if (!empleado.dato_financiero) return [];
  const afp = index % 2 === 0;
  const eps = empleado.dato_financiero.regimen_salud === "EPS";
  const data = CrearDatoFinancieroSchema.parse({
    empleado_id: empleado.id,
    sueldo_basico: empleado.dato_financiero.sueldo_basico,
    id_regimen: REGIMENES_PENSION_MOCK[afp ? 0 : 1].id,
    id_tipo_afp: afp ? AFPS_MOCK[1].id : null,
    cuspp: afp ? `ABC12345${String(index).padStart(4, "0")}` : null,
    tipo_comision: afp ? "MIXTA" : null,
    id_banco_sueldo: BANCOS_MOCK[0].id,
    tipo_cuenta_sueldo: "SUELDO",
    nro_cuenta_sueldo: `00012345${String(index).padStart(4, "0")}`,
    cci_sueldo: `002${String(index + 123456).padStart(17, "0")}`,
    id_banco_cts: BANCOS_MOCK[1].id,
    tipo_cuenta_cts: "AHORROS",
    nro_cuenta_cts: `00054321${String(index).padStart(4, "0")}`,
    cci_cts: `011${String(index + 654321).padStart(17, "0")}`,
    regimen_salud: empleado.dato_financiero.regimen_salud,
    eps_nombre: eps ? "Pacífico" : null,
    eps_plan: eps ? "Plan familiar" : null,
    eps_costo_adicional: eps ? 80 : 0,
  });
  return [{ ...data, id: crypto.randomUUID(), created_at: "2026-04-01T12:00:00.000Z", updated_at: "2026-10-01T12:00:00.000Z" }];
});

/** Mantiene las cuentas y el CUSPP ocultos en las respuestas de prueba */
function mask(value?: string | null, visibles = 4): string | null {
  if (!value) return null;
  return value.length <= visibles ? "****" : "*".repeat(value.length - visibles) + value.slice(-visibles);
}

function getRegistrosFinancieros(): FinancieroMock[] {
  // Una importacion puede actualizar un registro que ya existia en los ejemplos
  const idsRegistrados = new Set(FINANCIEROS_REGISTRADOS_MOCK.map((item) => item.empleado_id));
  return [...FINANCIEROS_FICHA_MOCK.filter((item) => !idsRegistrados.has(item.empleado_id)), ...FINANCIEROS_REGISTRADOS_MOCK];
}

/** Entrega los nombres de catalogos y campos enmascarados del endpoint de consulta */
function toResponse(data: FinancieroMock): FinancieroEmpleado {
  return {
    id: data.id, empleado_id: data.empleado_id,
    id_regimen: data.id_regimen, regimen_nombre: REGIMENES_PENSION_MOCK.find((item) => item.id === data.id_regimen)?.nombre ?? null,
    id_tipo_afp: data.id_tipo_afp ?? null, afp_nombre: AFPS_MOCK.find((item) => item.id === data.id_tipo_afp)?.nombre ?? null,
    cuspp: mask(data.cuspp, 3), tipo_comision: data.tipo_comision ?? null, sueldo_basico: data.sueldo_basico,
    id_banco_sueldo: data.id_banco_sueldo ?? null, banco_sueldo_nombre: BANCOS_MOCK.find((item) => item.id === data.id_banco_sueldo)?.nombre ?? null,
    tipo_cuenta_sueldo: data.tipo_cuenta_sueldo, nro_cuenta_sueldo: mask(data.nro_cuenta_sueldo), cci_sueldo: mask(data.cci_sueldo),
    id_banco_cts: data.id_banco_cts ?? null, banco_cts_nombre: BANCOS_MOCK.find((item) => item.id === data.id_banco_cts)?.nombre ?? null,
    tipo_cuenta_cts: data.tipo_cuenta_cts, nro_cuenta_cts: mask(data.nro_cuenta_cts), cci_cts: mask(data.cci_cts),
    regimen_salud: data.regimen_salud, eps_nombre: data.eps_nombre ?? null, eps_plan: data.eps_plan ?? null, eps_costo_adicional: data.eps_costo_adicional,
    created_at: data.created_at ?? "2026-10-14T12:00:00.000Z", updated_at: data.updated_at ?? "2026-10-14T12:00:00.000Z",
  };
}

export function getFinancierosDetalleMock(): FinancieroEmpleado[] {
  return getRegistrosFinancieros().map(toResponse);
}

function validarCatalogos(data: Partial<CrearDatoFinancieroDto>): void {
  if (data.id_regimen && !REGIMENES_PENSION_MOCK.some((item) => item.id === data.id_regimen)) throw new Error("El régimen de pensión no existe");
  if (data.id_tipo_afp && !AFPS_MOCK.some((item) => item.id === data.id_tipo_afp)) throw new Error("La AFP seleccionada no existe");
  for (const id of [data.id_banco_sueldo, data.id_banco_cts]) {
    if (id && !BANCOS_MOCK.some((item) => item.id === id)) throw new Error("El banco seleccionado no existe");
  }
}

/** Guarda el registro y actualiza el sueldo y salud que muestra el listado */
function guardarFinanciero(data: FinancieroMock): FinancieroEmpleado {
  const records = FINANCIEROS_REGISTRADOS_MOCK.some((item) => item.empleado_id === data.empleado_id) ? FINANCIEROS_REGISTRADOS_MOCK : FINANCIEROS_FICHA_MOCK;
  const index = records.findIndex((item) => item.empleado_id === data.empleado_id);
  if (index >= 0) records[index] = data;
  else records.push(data);
  const empleadoIndex = EMPLEADOS_MOCK.findIndex((item) => item.id === data.empleado_id);
  if (empleadoIndex >= 0) EMPLEADOS_MOCK[empleadoIndex] = { ...EMPLEADOS_MOCK[empleadoIndex], dato_financiero: { sueldo_basico: data.sueldo_basico, regimen_salud: data.regimen_salud } };
  return toResponse(data);
}

/** Registra datos financieros cuando el empleado aun no tiene una ficha */
export function crearFinancieroEmpleadoMock(values: CrearDatoFinancieroDto): FinancieroEmpleado {
  const data = CrearDatoFinancieroSchema.parse(values);
  const empleado = EMPLEADOS_MOCK.find((item) => item.id === data.empleado_id && !item.deleted_at);
  if (!empleado) throw new Error("El empleado no existe o fue dado de baja");
  if (getRegistrosFinancieros().some((item) => item.empleado_id === data.empleado_id)) throw new Error("El empleado ya tiene datos financieros registrados");
  validarCatalogos(data);
  const fecha = new Date().toISOString();
  return guardarFinanciero({ ...data, id: crypto.randomUUID(), created_at: fecha, updated_at: fecha });
}

/** Actualiza solo lo enviado y nunca conserva la contraseña de confirmacion */
export function editarFinancieroEmpleadoMock(empleadoId: string, values: ActualizarDatoFinancieroDto): FinancieroEmpleado {
  const actual = getRegistrosFinancieros().find((item) => item.empleado_id === empleadoId);
  if (!actual) throw new Error("El empleado no tiene datos financieros registrados");
  const { password_confirmacion: password, ...data } = ActualizarDatoFinancieroSchema.parse(values);
  if (password !== PASSWORD_FINANCIERO_MOCK) throw new Error("La contraseña de prueba es incorrecta");
  validarCatalogos(data);
  const cambios = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  return guardarFinanciero({ ...actual, ...cambios, updated_at: new Date().toISOString() });
}
