import { CargaMasivaFilaSchema, type CargaMasivaFilaDTO, type CrearDatoFinancieroDto } from "@jyp/shared-contracts";
import type { EscenarioImportacion, ReporteImportacion, TrabajoImportacion, ConfirmarImportacionDto } from "../types/importar-empleados.types";
import type { EmpleadoListado } from "../types/empleados.types";
import { AREAS_MOCK, CARGOS_MOCK, EMPLEADOS_MOCK, JORNADAS_MOCK } from "./empleados.mock";
import { AFPS_MOCK, BANCOS_MOCK, FINANCIEROS_REGISTRADOS_MOCK, REGIMENES_PENSION_MOCK } from "./registro-empleado.mock";

const BASE_FILA = {
  tipo_documento: "DNI",
  sexo: "M",
  estado_civil: "S",
  fecha_nacimiento: "1992-04-15",
  direccion: "Av. Ejemplo 120",
  departamento: "Lima",
  provincia: "Lima",
  distrito: "Lima",
  ubigeo: "150101",
  fecha_inicio: "2026-10-01",
  regimen_pension: "ONP",
  sueldo_basico: 2500,
};

/** Datos de prueba para recorrer validacion y procesamiento */
export function getFilasImportacionMock(escenario: EscenarioImportacion): Record<string, unknown>[] {
  const filas = [
    { ...BASE_FILA, nro_documento: "72849102", nombre: "Carlos Andrés", apellido: "Méndez Ruiz", area: AREAS_MOCK[0].nombre, cargo: CARGOS_MOCK[0].nombre, jornada: JORNADAS_MOCK[0].nombre, sueldo_basico: 3300 },
    { ...BASE_FILA, nro_documento: "81000001", nombre: "Paula", apellido: "Rojas Gómez", area: "Servicios Generales", cargo: "Analista de servicios", sexo: "F" },
    { ...BASE_FILA, nro_documento: "81000002", nombre: "Ana Lucía", apellido: "Ramos Díaz", area: AREAS_MOCK[2].nombre, cargo: CARGOS_MOCK[2].nombre, sexo: "F", sueldo_basico: 4100 },
    { ...BASE_FILA, nro_documento: "81000003", nombre: "Jorge", apellido: "Salas Rivera", area: AREAS_MOCK[1].nombre, cargo: CARGOS_MOCK[1].nombre },
    { ...BASE_FILA, nro_documento: "81000004", nombre: "Lucía", apellido: "Pérez Torres", area: AREAS_MOCK[4].nombre, cargo: CARGOS_MOCK[4].nombre, sexo: "F" },
  ];
  if (escenario === "sin_validas") return filas.map((fila) => ({ ...fila, fecha_inicio: "01/10/2026" }));
  if (escenario === "validacion") {
    return [
      ...filas,
      { ...filas[1], nro_documento: "" },
      { ...filas[2], nro_documento: "81000006", email: "correo-invalido", direccion: "X" },
    ];
  }
  return filas;
}

/** Construye el mismo reporte de validacion sin guardar empleados */
export function validarImportacionMock(escenario: EscenarioImportacion): ReporteImportacion {
  const filas = getFilasImportacionMock(escenario);
  const reporte: ReporteImportacion = {
    total_filas: filas.length,
    filas_validas: 0,
    filas_invalidas: 0,
    errores_detalle: [],
    filas_validas_data: [],
  };
  filas.forEach((fila, index) => {
    if (!fila.nro_documento) {
      reporte.errores_detalle.push({ fila: index + 2, columna: "nro_documento", valor_recibido: fila.nro_documento, mensaje: "El número de documento es obligatorio." });
      return;
    }
    const resultado = CargaMasivaFilaSchema.safeParse(fila);
    if (resultado.success) reporte.filas_validas_data.push(resultado.data);
    else resultado.error.issues.forEach((issue) => {
      reporte.errores_detalle.push({ fila: index + 2, columna: issue.path.join("."), valor_recibido: fila[String(issue.path[0])], mensaje: issue.message });
    });
  });
  reporte.filas_validas = reporte.filas_validas_data.length;
  reporte.filas_invalidas = reporte.errores_detalle.length;
  return reporte;
}

/** Crea el trabajo de prueba al confirmar las filas validas */
export function confirmarImportacionMock(payload: ConfirmarImportacionDto): TrabajoImportacion {
  if (!payload.filas_validas_data.length) throw new Error("No hay filas válidas proporcionadas para procesar");
  return { id: crypto.randomUUID(), estado: "EN_COLA", total_registros: payload.filas_validas_data.length, procesados: 0, fallidos: 0, errores_detalle: [], updated_at: new Date().toISOString() };
}

/** Inserta o actualiza por documento, igual que el worker de carga masiva */
function guardarFilaImportacionMock(fila: CargaMasivaFilaDTO): void {
  const equals = (a: string, b: string) => a.trim().toLocaleLowerCase("es-PE") === b.trim().toLocaleLowerCase("es-PE");
  let area = AREAS_MOCK.find((item) => equals(item.nombre, fila.area));
  if (!area) {
    area = { id: crypto.randomUUID(), nombre: fila.area };
    AREAS_MOCK.push(area);
  }
  let cargo = CARGOS_MOCK.find((item) => item.id_area === area.id && equals(item.nombre, fila.cargo));
  if (!cargo) {
    cargo = { id: crypto.randomUUID(), id_area: area.id, nombre: fila.cargo };
    CARGOS_MOCK.push(cargo);
  }
  const jornada = JORNADAS_MOCK.find((item) => fila.jornada && equals(item.nombre, fila.jornada)) ?? null;
  const actual = EMPLEADOS_MOCK.find((item) => item.nro_documento === fila.nro_documento);
  const empleado: EmpleadoListado = {
    ...actual,
    ...fila,
    id: actual?.id ?? crypto.randomUUID(),
    nombre: fila.nombre || "NO_REGISTRADO",
    apellido: fila.apellido || "NO_REGISTRADO",
    email: fila.email ?? null,
    area_id: area.id,
    cargo_id: cargo.id,
    jornada_id: jornada?.id ?? null,
    area,
    cargo,
    jornada,
    activo: true,
    estado_laboral: actual?.estado_laboral ?? "ACTIVO",
    dato_financiero: { sueldo_basico: fila.sueldo_basico, regimen_salud: fila.regimen_salud },
  };
  if (actual) Object.assign(actual, empleado);
  else EMPLEADOS_MOCK.push(empleado);
  EMPLEADOS_MOCK.sort((a, b) => (a.apellido ?? "").localeCompare(b.apellido ?? "", "es-PE"));

  const bancoId = (nombre?: string | null) => BANCOS_MOCK.find((item) => nombre && item.nombre.toLowerCase().includes(nombre.toLowerCase()))?.id ?? null;
  const datos: CrearDatoFinancieroDto = {
    empleado_id: empleado.id,
    id_regimen: REGIMENES_PENSION_MOCK[fila.regimen_pension === "AFP" ? 0 : 1].id,
    id_tipo_afp: fila.regimen_pension === "AFP" ? AFPS_MOCK.find((item) => fila.tipo_afp && equals(item.nombre, fila.tipo_afp))?.id ?? null : null,
    cuspp: fila.cuspp ?? null,
    tipo_comision: fila.tipo_comision ?? null,
    sueldo_basico: fila.sueldo_basico,
    id_banco_sueldo: bancoId(fila.banco_sueldo),
    tipo_cuenta_sueldo: fila.tipo_cuenta_sueldo,
    nro_cuenta_sueldo: fila.nro_cuenta_sueldo ?? null,
    cci_sueldo: fila.cci_sueldo ?? null,
    id_banco_cts: bancoId(fila.banco_cts),
    tipo_cuenta_cts: fila.tipo_cuenta_cts,
    nro_cuenta_cts: fila.nro_cuenta_cts ?? null,
    cci_cts: fila.cci_cts ?? null,
    regimen_salud: fila.regimen_salud,
    eps_costo_adicional: fila.eps_costo_adicional,
  };
  const financiero = FINANCIEROS_REGISTRADOS_MOCK.find((item) => item.empleado_id === empleado.id);
  if (financiero) Object.assign(financiero, datos);
  else FINANCIEROS_REGISTRADOS_MOCK.push({ ...datos, id: crypto.randomUUID() });
}

/** Avanza el trabajo de prueba una fila a la vez */
export function avanzarImportacionMock(job: TrabajoImportacion, filas: CargaMasivaFilaDTO[], escenario: EscenarioImportacion): TrabajoImportacion {
  if (job.estado === "EN_COLA") return { ...job, estado: "PROCESANDO", updated_at: new Date().toISOString() };
  if (job.estado !== "PROCESANDO") return job;
  const index = job.procesados + job.fallidos;
  const fila = filas[index];
  if (!fila) return job;
  const next = { ...job, errores_detalle: [...job.errores_detalle], updated_at: new Date().toISOString() };
  try {
    if (escenario === "fallido" || (escenario === "parcial" && index === 1)) throw new Error("Fallo simulado al guardar esta fila");
    guardarFilaImportacionMock(fila);
    next.procesados++;
  } catch (error) {
    next.fallidos++;
    next.errores_detalle.push({ Dni: fila.nro_documento, causa: error instanceof Error ? error.message : "No se pudo guardar el registro" });
  }
  if (next.procesados + next.fallidos === next.total_registros) next.estado = next.procesados === 0 ? "FALLIDO" : "COMPLETADO";
  return next;
}
