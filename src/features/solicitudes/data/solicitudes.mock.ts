import {
  CrearSolicitudSchema,
  EvaluarSolicitudSchema,
  type CrearSolicitudDto,
  type EvaluarSolicitudDto,
  type TipoSolicitud,
} from "@jyp/shared-contracts";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import type {
  SolicitudHistorial,
  SolicitudListado,
  SolicitudEstado,
} from "../types/solicitudes.types";

const revisor = "80000000-0000-4000-8000-000000000001";
const tipos: TipoSolicitud[] = [
  "VACACIONES",
  "LICENCIA_MEDICA",
  "PERMISO",
  "ADELANTO_SUELDO",
  "JUSTIFICACION_ASISTENCIA",
  "ACTUALIZACION_DATOS",
];
const empleados = EMPLEADOS_MOCK.filter((item) => item.activo);
const solicitudes: SolicitudListado[] = tipos.map((tipo, index) => {
  const emp = empleados[index];
  return {
    ...CrearSolicitudSchema.parse({
      empleado_id: emp.id,
      tipo,
      monto: tipo === "ADELANTO_SUELDO" ? 1200 : null,
      fecha_inicio: "2026-10-19",
      fecha_fin: "2026-10-23",
      dias_solicitados: 5,
      motivo: [
        "Descanso vacacional del periodo",
        "Atención médica y recuperación",
        "Trámite personal programado",
        "Adelanto por gastos familiares",
        "Sustento de asistencia",
        "Actualización de contacto",
      ][index],
      origen: "MANUAL_RRHH",
    }),
    id: `a0000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    codigo: `SOL-2026-${String(index + 1).padStart(3, "0")}`,
    empleado_id: emp.id,
    estado:
      index < 3
        ? "PENDIENTE"
        : index === 3
          ? "EN_REVISION"
          : index === 4
            ? "APROBADA"
            : "RECHAZADA",
    fecha_solicitud: `2026-10-${String(13 - index).padStart(2, "0")}T14:30:00.000Z`,
    responsable_id: index >= 3 ? revisor : null,
    colaborador_resumen: {
      id: emp.id,
      nombre_completo: getEmpleadoNombre(emp),
      documento: emp.nro_documento,
      area: emp.area.nombre,
      cargo: emp.cargo.nombre,
    },
  };
});
const historial = new Map<string, SolicitudHistorial[]>(
  solicitudes.map((item) => [
    item.id,
    [
      {
        id: crypto.randomUUID(),
        fecha: item.fecha_solicitud,
        accion: "Solicitud registrada",
        actor: { nombre_completo: "Recursos Humanos" },
        cambios: {
          estado: { anterior: null, nuevo: "PENDIENTE" },
          observacion: { nuevo: null },
        },
      },
      ...(item.estado === "PENDIENTE"
        ? []
        : [
            {
              id: crypto.randomUUID(),
              fecha: "2026-10-14T14:00:00.000Z",
              accion: "Estado actualizado",
              actor: { nombre_completo: "Recursos Humanos" },
              cambios: {
                estado: { anterior: "PENDIENTE" as const, nuevo: item.estado },
                observacion: { nuevo: item.observacion ?? null },
              },
            },
          ]),
    ],
  ]),
);

export function getSolicitudesMock(): SolicitudListado[] {
  return [...solicitudes];
}

export function getHistorialSolicitudMock(id: string): SolicitudHistorial[] {
  return [...(historial.get(id) ?? [])];
}

/** Cambia el estado y agrega una entrada al historial de la demostracion */
function actualizarSolicitud(
  id: string,
  estado: SolicitudEstado,
  accion: string,
  observacion?: string | null,
): void {
  const index = solicitudes.findIndex((item) => item.id === id);
  const actual = solicitudes[index];
  if (!actual || !["PENDIENTE", "EN_REVISION"].includes(actual.estado))
    throw new Error("La solicitud ya está finalizada");
  solicitudes[index] = {
    ...actual,
    estado,
    observacion: observacion || actual.observacion,
    responsable_id: estado === "EN_REVISION" ? revisor : actual.responsable_id,
  };
  historial.set(id, [
    ...getHistorialSolicitudMock(id),
    {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      accion,
      actor: { nombre_completo: "Recursos Humanos" },
      cambios: {
        estado: { anterior: actual.estado, nuevo: estado },
        observacion: { nuevo: observacion ?? null },
      },
    },
  ]);
}

export function tomarRevisionMock(id: string): void {
  actualizarSolicitud(id, "EN_REVISION", "Asignada a revisión");
}

export function evaluarSolicitudMock(
  id: string,
  values: EvaluarSolicitudDto,
): void {
  const data = EvaluarSolicitudSchema.parse(values);
  const actual = solicitudes.find((item) => item.id === id);
  if (actual?.estado !== "EN_REVISION" || actual.responsable_id !== revisor)
    throw new Error("Primero toma la solicitud en revisión");
  if (data.estado === "RECHAZADA" && (data.observacion?.trim().length ?? 0) < 5)
    throw new Error("Escribe un motivo de rechazo de al menos 5 caracteres");
  actualizarSolicitud(
    id,
    data.estado,
    data.estado === "APROBADA" ? "Solicitud aprobada" : "Solicitud rechazada",
    data.observacion,
  );
}

export function anularSolicitudMock(id: string, motivo: string): void {
  if (motivo.trim().length < 5 || motivo.length > 2000)
    throw new Error("Escribe un motivo de entre 5 y 2000 caracteres");
  actualizarSolicitud(id, "ANULADA", "Solicitud anulada", motivo.trim());
}

/** Valida los requisitos del tipo elegido antes de crear la solicitud */
export function crearSolicitudMock(values: CrearSolicitudDto): void {
  const data = CrearSolicitudSchema.parse(values);
  if (data.motivo.trim().length < 5)
    throw new Error("El motivo debe tener al menos 5 caracteres");
  data.motivo = data.motivo.trim();
  data.observacion = data.observacion?.trim() || null;
  for (const fecha of [data.fecha_inicio, data.fecha_fin]) {
    if (
      fecha &&
      (Number.isNaN(Date.parse(fecha)) ||
        new Date(fecha).toISOString().slice(0, 10) !== fecha)
    )
      throw new Error("Ingresa una fecha válida");
  }
  const emp = EMPLEADOS_MOCK.find(
    (item) => item.id === data.empleado_id && item.activo && !item.deleted_at,
  );
  if (!emp) throw new Error("Selecciona un empleado activo");
  if (
    ["VACACIONES", "LICENCIA_MEDICA", "PERMISO"].includes(data.tipo) &&
    (!data.fecha_inicio || !data.fecha_fin)
  )
    throw new Error("Este tipo de solicitud requiere ambas fechas");
  if (data.fecha_inicio && data.fecha_fin && data.fecha_inicio > data.fecha_fin)
    throw new Error(
      "La fecha de inicio no puede ser posterior a la fecha de fin",
    );
  if (data.tipo === "VACACIONES" && (data.dias_solicitados ?? 0) > 365)
    throw new Error("Vacaciones admite hasta 365 días solicitados");
  if (
    data.tipo === "ADELANTO_SUELDO" &&
    (!data.monto ||
      data.monto <= 0 ||
      data.monto > 99999999.9999 ||
      Math.abs(data.monto * 10000 - Math.round(data.monto * 10000)) > 0.001)
  )
    throw new Error(
      "El adelanto requiere un monto positivo, hasta 99999999.9999 y con hasta cuatro decimales",
    );
  const next: SolicitudListado = {
    ...data,
    id: crypto.randomUUID(),
    codigo: `SOL-2026-${String(solicitudes.length + 1).padStart(3, "0")}`,
    empleado_id: emp.id,
    estado: "PENDIENTE",
    fecha_solicitud: new Date().toISOString(),
    responsable_id: null,
    colaborador_resumen: {
      id: emp.id,
      nombre_completo: getEmpleadoNombre(emp),
      documento: emp.nro_documento,
      area: emp.area.nombre,
      cargo: emp.cargo.nombre,
    },
  };
  solicitudes.unshift(next);
  historial.set(next.id, [
    {
      id: crypto.randomUUID(),
      fecha: next.fecha_solicitud,
      accion: "Solicitud registrada",
      actor: { nombre_completo: "Recursos Humanos" },
      cambios: {
        estado: { anterior: null, nuevo: "PENDIENTE" },
        observacion: { nuevo: null },
      },
    },
  ]);
}
