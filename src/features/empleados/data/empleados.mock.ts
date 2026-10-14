import type {
  EstadoEmpleado,
  ListarEmpleadosQueryDto,
} from "@jyp/shared-contracts";
import type {
  EmpleadoCatalogo,
  EmpleadoListado,
  ListarEmpleadosResponse,
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
export const CARGOS_MOCK: EmpleadoCatalogo[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    nombre: "Supervisor de almacén",
  },
  { id: "20000000-0000-4000-8000-000000000002", nombre: "Ejecutivo de ventas" },
  {
    id: "20000000-0000-4000-8000-000000000003",
    nombre: "Ingeniero de software",
  },
  { id: "20000000-0000-4000-8000-000000000004", nombre: "Analista contable" },
  {
    id: "20000000-0000-4000-8000-000000000005",
    nombre: "Especialista de RRHH",
  },
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
      documento_id: "40000000-0000-4000-8000-000000000001",
      email: index === 12 ? null : `empleado${index + 1}@example.com`,
      telefono: index % 4 === 0 ? null : String(900000000 + index),
      sexo: index % 2 === 0 ? "MASCULINO" : "FEMENINO",
      estado_civil: index % 3 === 0 ? "CASADO" : "SOLTERO",
      nacionalidad: "PERUANA",
      fecha_nacimiento: `${1988 + (index % 12)}-04-15T00:00:00.000Z`,
      direccion: index % 6 === 0 ? null : `Av. Ejemplo ${100 + index}`,
      referencia_direccion: null,
      ubigeo: "150101",
      distrito: "Lima",
      provincia: "Lima",
      departamento: "Lima",
      area_id: area.id,
      cargo_id: cargo.id,
      jornada_id: jornada?.id ?? null,
      area,
      cargo,
      jornada,
      fecha_inicio:
        index === 15 ? null : `${2020 + (index % 6)}-10-05T00:00:00.000Z`,
      fecha_cese: activo ? null : "2026-09-29T00:00:00.000Z",
      deleted_at: activo ? null : "2026-09-29T00:00:00.000Z",
      afp_fecha_filiacion: index % 4 === 0 ? null : "2020-10-05T00:00:00.000Z",
      asig_familiar: index % 3 === 0,
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

/** Usa los filtros del contrato e incluye las bajas para poder consultarlas */
export function getEmpleadosMock(
  query: ListarEmpleadosQueryDto,
): ListarEmpleadosResponse {
  const search = query.search?.trim().toLocaleLowerCase("es-PE");
  const filtered = EMPLEADOS_MOCK.filter((empleado) => {
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

  const skip = (query.page - 1) * query.limit;
  return {
    statusCode: 200,
    data: filtered.slice(skip, skip + query.limit),
    meta: {
      total: filtered.length,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(filtered.length / query.limit),
      message: "Operación exitosa.",
      path: "/api/rrhh/empleado",
      timestamp: new Date().toISOString(),
    },
  };
}
