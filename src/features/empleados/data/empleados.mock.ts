import { CrearEmpleadoSchema, type CrearEmpleadoDto, type EstadoEmpleado } from "@jyp/shared-contracts";
import type {
  EmpleadoCatalogo,
  EmpleadoCargo,
  EmpleadoListado,
  EmpleadosQuery,
} from "../types/empleados.types";

// Los catalogos usan IDs como los que espera el filtro del backend
export const AREAS_MOCK: EmpleadoCatalogo[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    nombre: "Operaciones y Logística",
  },
  { id: "10000000-0000-4000-8000-000000000002", nombre: "Ventas y Comercial" },
  {
    id: "10000000-0000-4000-8000-000000000003",
    nombre: "Tecnología y Desarrollo",
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    nombre: "Administración y Finanzas",
  },
  { id: "10000000-0000-4000-8000-000000000005", nombre: "Recursos Humanos" },
];
export const CARGOS_MOCK: EmpleadoCargo[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    id_area: AREAS_MOCK[0].id,
    nombre: "Supervisor de almacén",
  },
  { id: "20000000-0000-4000-8000-000000000002", id_area: AREAS_MOCK[1].id, nombre: "Ejecutivo de ventas" },
  {
    id: "20000000-0000-4000-8000-000000000003",
    id_area: AREAS_MOCK[2].id,
    nombre: "Ingeniero de software",
  },
  { id: "20000000-0000-4000-8000-000000000004", id_area: AREAS_MOCK[3].id, nombre: "Analista contable" },
  {
    id: "20000000-0000-4000-8000-000000000005",
    id_area: AREAS_MOCK[4].id,
    nombre: "Especialista de RRHH",
  },
];
export const DOCUMENTOS_MOCK: EmpleadoCatalogo[] = [
  { id: "40000000-0000-4000-8000-000000000001", nombre: "DNI" },
  { id: "40000000-0000-4000-8000-000000000002", nombre: "Carné de extranjería" },
  { id: "40000000-0000-4000-8000-000000000003", nombre: "Pasaporte" },
  { id: "40000000-0000-4000-8000-000000000004", nombre: "PTP" },
];
export const JORNADAS_MOCK = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    nombre: "Tiempo completo",
    turno: "MANANA",
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    nombre: "Tiempo parcial",
    turno: "TARDE",
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    nombre: "Jornada rotativa",
    turno: "ROTATIVO",
  },
];

const personas = [
  ["Carlos Andrés", "Méndez Ruiz"],
  ["Valeria Sofía", "Pardo León"],
  ["Jorge Ignacio", "Morales Vega"],
  ["Mariana Lucía", "Torres Silva"],
  ["Roberto Carlos", "Benavides"],
  ["Claudia Patricia", "Vega Rivas"],
  ["Daniela Fernanda", "Quispe Ortiz"],
  ["Luis Alberto", "Aguilar Ramos"],
  ["Camila", "Alvarado Pérez"],
  ["Diego", "Castro Mendoza"],
  ["Andrea", "Delgado Torres"],
  ["Mateo", "Espinoza León"],
  ["Paola", "Fernández Ruiz"],
  ["Gabriel", "García Flores"],
  ["Lucía", "Herrera Salas"],
  ["Sebastián", "Jiménez Vargas"],
  ["Isabel", "López Rojas"],
  ["Fernando", "Navarro Díaz"],
  ["Natalia", "Ortega Campos"],
  ["Ricardo", "Paredes Soto"],
  ["Valentina", "Ramírez Cruz"],
  ["Adrián", "Sánchez Peña"],
  ["Elena", "Ugarte Medina"],
  ["Bruno", "Vásquez Luna"],
];
const estados: EstadoEmpleado[] = [
  "ACTIVO",
  "ACTIVO",
  "VACACIONES",
  "ACTIVO",
  "LICENCIA",
  "SUSPENDIDO",
];

/** Datos locales para revisar filas, filtros y variantes del diseño */
export const EMPLEADOS_MOCK: EmpleadoListado[] = personas
  .map<EmpleadoListado>(([nombre, apellido], index) => {
    const area = AREAS_MOCK[index % AREAS_MOCK.length];
    const cargo = CARGOS_MOCK[index % CARGOS_MOCK.length];
    const jornada =
      index % 7 === 3 ? null : JORNADAS_MOCK[index % JORNADAS_MOCK.length];
    const activo = index !== 6 && index !== 19 && index !== 23;

    return {
      id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
      nombre,
      apellido,
      nro_documento: String(72849102 + index * 17),
      email: index === 12 ? null : `empleado${index + 1}@example.com`,
      area_id: area.id,
      cargo_id: cargo.id,
      jornada_id: jornada?.id ?? null,
      area,
      cargo,
      jornada,
      fecha_inicio:
        index === 15 ? null : `${2020 + (index % 6)}-10-05T00:00:00.000Z`,
      estado_laboral: activo ? estados[index % estados.length] : "CESADO",
      activo,
      dato_financiero:
        index % 8 === 7
          ? null
          : {
              sueldo_basico: String(1500 + (index % 5) * 650),
              regimen_salud: index % 3 === 0 ? "EPS" : "ESSALUD_REGULAR",
            },
    };
  })
  .sort((a, b) => (a.apellido ?? "").localeCompare(b.apellido ?? "", "es-PE"));

/** Filtra el arreglo local y deja que TanStack divida las paginas */
export function getEmpleadosMock(
  query: EmpleadosQuery,
): EmpleadoListado[] {
  const search = query.search?.trim().toLocaleLowerCase("es-PE");
  return EMPLEADOS_MOCK.filter((empleado) => {
    if (query.area_id && empleado.area_id !== query.area_id) return false;
    if (query.cargo_id && empleado.cargo_id !== query.cargo_id) return false;
    if (query.jornada_id && empleado.jornada_id !== query.jornada_id)
      return false;
    if (query.activo !== undefined && empleado.activo !== query.activo)
      return false;
    return (
      !search ||
      [
        empleado.nombre,
        empleado.apellido,
        empleado.nro_documento,
        empleado.email,
      ].some((value) => value?.toLocaleLowerCase("es-PE").includes(search))
    );
  });
}

/** Agrega un empleado a los datos de prueba durante esta visita */
export function registrarEmpleadoMock(values: CrearEmpleadoDto): EmpleadoListado {
  const data = CrearEmpleadoSchema.parse(values);
  if (EMPLEADOS_MOCK.some((empleado) => empleado.nro_documento === data.nro_documento)) {
    throw new Error("Ya existe un empleado con este número de documento");
  }

  const area = AREAS_MOCK.find((item) => item.id === data.area_id);
  const cargo = CARGOS_MOCK.find((item) => item.id === data.cargo_id);
  const documento = DOCUMENTOS_MOCK.find((item) => item.id === data.documento_id);
  const jornada = JORNADAS_MOCK.find((item) => item.id === data.jornada_id) ?? null;
  if (!area || !cargo || !documento || (data.jornada_id && !jornada)) {
    throw new Error("Selecciona los datos laborales y el documento de los catálogos disponibles");
  }

  const empleado: EmpleadoListado = {
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

  // Solo cambia el arreglo local, al recargar se recuperan los datos iniciales
  EMPLEADOS_MOCK.push(empleado);
  EMPLEADOS_MOCK.sort((a, b) => (a.apellido ?? "").localeCompare(b.apellido ?? "", "es-PE"));
  return empleado;
}
