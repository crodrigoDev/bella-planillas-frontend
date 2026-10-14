import {
  CrearContratoSchema,
  CrearDatoFinancieroSchema,
  type BancoDto,
  type CrearContratoDto,
  type CrearDatoFinancieroDto,
  type TipoAfpDto,
} from "@jyp/shared-contracts";
import { RegistroEmpleadoSchema } from "../schemas/registro-empleado.schema";
import type { RegistroEmpleadoDto } from "../types/crear-empleado.types";
import type { EmpleadoCatalogo } from "../types/empleados.types";
import { registrarEmpleadoMock } from "./empleados.mock";

export const REGIMENES_PENSION_MOCK: EmpleadoCatalogo[] = [
  { id: "50000000-0000-4000-8000-000000000001", nombre: "AFP" },
  { id: "50000000-0000-4000-8000-000000000002", nombre: "ONP" },
];

export const AFPS_MOCK: TipoAfpDto[] = [
  { id: "60000000-0000-4000-8000-000000000001", id_regimen: REGIMENES_PENSION_MOCK[0].id, nombre: "Integra" },
  { id: "60000000-0000-4000-8000-000000000002", id_regimen: REGIMENES_PENSION_MOCK[0].id, nombre: "Prima" },
  { id: "60000000-0000-4000-8000-000000000003", id_regimen: REGIMENES_PENSION_MOCK[0].id, nombre: "Profuturo" },
  { id: "60000000-0000-4000-8000-000000000004", id_regimen: REGIMENES_PENSION_MOCK[0].id, nombre: "Habitat" },
];

export const BANCOS_MOCK: BancoDto[] = [
  { id: "70000000-0000-4000-8000-000000000001", nombre: "BCP" },
  { id: "70000000-0000-4000-8000-000000000002", nombre: "BBVA" },
  { id: "70000000-0000-4000-8000-000000000003", nombre: "Interbank" },
  { id: "70000000-0000-4000-8000-000000000004", nombre: "Scotiabank" },
];

// Conserva los registros relacionados durante esta visita a la aplicacion
export const CONTRATOS_REGISTRADOS_MOCK: (CrearContratoDto & { id: string })[] = [];
export const FINANCIEROS_REGISTRADOS_MOCK: (CrearDatoFinancieroDto & { id: string })[] = [];

/** Simula el alta de empleado, contrato y datos financieros en ese orden */
export function registrarEmpleadoCompletoMock(values: RegistroEmpleadoDto) {
  // Valida todo antes de modificar los arreglos de prueba
  const { contrato, financiero, ...datosEmpleado } = RegistroEmpleadoSchema.parse(values);
  const regimen = REGIMENES_PENSION_MOCK.find((item) => item.id === financiero.id_regimen);
  const afpValida = !financiero.id_tipo_afp || AFPS_MOCK.some((item) => item.id === financiero.id_tipo_afp);
  const bancosValidos = [financiero.id_banco_sueldo, financiero.id_banco_cts]
    .every((id) => !id || BANCOS_MOCK.some((item) => item.id === id));
  if (!regimen || !afpValida || !bancosValidos) {
    throw new Error("Selecciona los datos financieros de los catálogos disponibles");
  }

  // Primero crea al empleado para obtener el ID de los otros dos registros
  const empleado = registrarEmpleadoMock(datosEmpleado);
  const datosContrato = CrearContratoSchema.parse({ ...contrato, empleado_id: empleado.id });
  CONTRATOS_REGISTRADOS_MOCK.push({ ...datosContrato, id: crypto.randomUUID() });

  const datosFinancieros = CrearDatoFinancieroSchema.parse({ ...financiero, empleado_id: empleado.id });
  FINANCIEROS_REGISTRADOS_MOCK.push({ ...datosFinancieros, id: crypto.randomUUID() });

  // Actualiza los datos que ya muestra el listado de empleados
  empleado.dato_financiero = {
    sueldo_basico: datosFinancieros.sueldo_basico,
    regimen_salud: datosFinancieros.regimen_salud,
  };
  return empleado;
}
