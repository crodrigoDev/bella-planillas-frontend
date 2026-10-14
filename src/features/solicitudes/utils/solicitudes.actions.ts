import {
  CrearSolicitudSchema,
  EvaluarSolicitudSchema,
  type CrearSolicitudDto,
  type EvaluarSolicitudDto,
} from "@jyp/shared-contracts";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import {
  SOLICITUDES_MOCK,
  SOLICITUD_HISTORIAL_MOCK,
} from "../data/solicitudes.mock";
import type {
  SolicitudListado,
  SolicitudEstado,
} from "../types/solicitudes.types";

const revisor = "80000000-0000-4000-8000-000000000001";

/** Cambia el estado y conserva la accion en el historial local */
function actualizarSolicitud(
  id: string,
  estado: SolicitudEstado,
  accion: string,
  observacion?: string | null,
): void {
  const index = SOLICITUDES_MOCK.findIndex((item) => item.id === id);
  const actual = SOLICITUDES_MOCK[index];
  if (!actual || !["PENDIENTE", "EN_REVISION"].includes(actual.estado))
    throw new Error("La solicitud ya está finalizada");
  SOLICITUDES_MOCK[index] = {
    ...actual,
    estado,
    observacion: observacion || actual.observacion,
    responsable_id: estado === "EN_REVISION" ? revisor : actual.responsable_id,
  };
  SOLICITUD_HISTORIAL_MOCK[id] = [
    ...(SOLICITUD_HISTORIAL_MOCK[id] ?? []),
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
  ];
}

export function tomarRevisionMock(id: string): void {
  actualizarSolicitud(id, "EN_REVISION", "Asignada a revisión");
}

export function evaluarSolicitudMock(
  id: string,
  values: EvaluarSolicitudDto,
): void {
  const data = EvaluarSolicitudSchema.parse(values);
  const actual = SOLICITUDES_MOCK.find((item) => item.id === id);
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

/** Registra los valores del formulario en el arreglo de la demostracion */
export function crearSolicitudMock(values: CrearSolicitudDto): void {
  const data = CrearSolicitudSchema.parse(values);
  const emp = EMPLEADOS_MOCK.find(
    (item) => item.id === data.empleado_id && item.activo && !item.deleted_at,
  );
  if (!emp) throw new Error("Selecciona un empleado activo");
  if (data.motivo.trim().length < 5)
    throw new Error("El motivo debe tener al menos 5 caracteres");
  if (
    ["VACACIONES", "LICENCIA_MEDICA", "PERMISO"].includes(data.tipo) &&
    (!data.fecha_inicio || !data.fecha_fin)
  )
    throw new Error("Este tipo de solicitud requiere ambas fechas");
  for (const fecha of [data.fecha_inicio, data.fecha_fin]) {
    if (
      fecha &&
      (Number.isNaN(Date.parse(fecha)) ||
        new Date(fecha).toISOString().slice(0, 10) !== fecha)
    )
      throw new Error("Ingresa una fecha válida");
  }
  if (data.fecha_inicio && data.fecha_fin && data.fecha_inicio > data.fecha_fin)
    throw new Error(
      "La fecha de inicio no puede ser posterior a la fecha de fin",
    );
  if (data.tipo === "VACACIONES" && (data.dias_solicitados ?? 0) > 365)
    throw new Error("Vacaciones admite hasta 365 días");
  if (
    data.tipo === "ADELANTO_SUELDO" &&
    (!data.monto ||
      data.monto <= 0 ||
      data.monto > 99999999.9999 ||
      Math.abs(data.monto * 10000 - Math.round(data.monto * 10000)) > 0.001)
  )
    throw new Error(
      "El monto debe ser positivo, hasta 99999999.9999 y con hasta cuatro decimales",
    );
  const next: SolicitudListado = {
    ...data,
    motivo: data.motivo.trim(),
    observacion: data.observacion?.trim() || null,
    id: crypto.randomUUID(),
    codigo: `SOL-2026-${String(SOLICITUDES_MOCK.length + 1).padStart(3, "0")}`,
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
  SOLICITUDES_MOCK.unshift(next);
  SOLICITUD_HISTORIAL_MOCK[next.id] = [
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
  ];
}
