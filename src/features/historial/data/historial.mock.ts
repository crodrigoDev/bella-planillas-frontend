import type { EventoHistorial } from "../types/historial.types";

/**
 * TEMPORAL: historial de ejemplo de un empleado.
 *
 * @remarks
 * El backend todavía no entrega un historial por empleado. Esta lista tiene la
 * forma que debería devolver y sirve para armar la pestaña. Lo que sale de la
 * auditoría actual (ingreso, contratos, familia, estado laboral, asistencia y
 * datos financieros) está pensado para llegar sin muchos cambios. Los eventos
 * de rotación (sueldo, cargo y área) son una maqueta hasta que se implemente.
 */
const RRHH = { nombre: "Carla Rojas", rol: "RRHH" };

export const HISTORIAL_EMPLEADO_MOCK: EventoHistorial[] = [
  {
    id: "ev-01",
    fecha: "2024-03-04",
    tipo: "INGRESO",
    titulo: "Ingreso a la empresa",
    descripcion:
      "Se registró al empleado como Analista de Soporte en el área de Operaciones.",
    actor: RRHH,
  },
  {
    id: "ev-02",
    fecha: "2024-03-04",
    tipo: "CONTRATO",
    titulo: "Contrato registrado",
    descripcion: "Plazo fijo del 04/03/2024 al 03/03/2025.",
    actor: RRHH,
  },
  {
    id: "ev-03",
    fecha: "2024-03-06",
    tipo: "FINANCIERO",
    titulo: "Datos financieros registrados",
    descripcion:
      "Se registraron el régimen de pensión, el sueldo básico y las cuentas bancarias.",
    actor: RRHH,
  },
  {
    id: "ev-04",
    fecha: "2025-03-04",
    tipo: "ROTACION",
    titulo: "Modificación",
    cambios: [
      { campo: "Sueldo básico", antes: "S/ 2,500.00", despues: "S/ 2,800.00" },
    ],
    sinCambios: [
      { campo: "Cargo", valor: "Analista de Soporte" },
      { campo: "Área", valor: "Operaciones" },
      { campo: "Jornada", valor: "Lunes a sábado, 48 horas" },
    ],
    vigenteHasta: "2025-11-30",
    actor: RRHH,
  },
  {
    id: "ev-05",
    fecha: "2025-03-04",
    tipo: "CONTRATO",
    titulo: "Contrato renovado",
    descripcion:
      "Se renovó el contrato: nuevo plazo fijo del 04/03/2025 al 03/03/2026.",
    actor: RRHH,
  },
  {
    id: "ev-06",
    fecha: "2025-03-05",
    tipo: "CONTRATO",
    titulo: "Contrato firmado",
    descripcion: "Se adjuntó el PDF firmado del contrato.",
    actor: RRHH,
  },
  {
    id: "ev-07",
    fecha: "2025-06-10",
    tipo: "FAMILIA",
    titulo: "Derechohabiente registrado",
    descripcion:
      "Hijo menor: Mateo Castillo. Se activó la asignación familiar del empleado.",
    actor: RRHH,
  },
  {
    id: "ev-08",
    fecha: "2025-06-12",
    tipo: "FAMILIA",
    titulo: "Sustento adjuntado",
    descripcion: "Partida de nacimiento de Mateo Castillo.",
    actor: RRHH,
  },
  {
    id: "ev-09",
    fecha: "2025-08-01",
    tipo: "ESTADO",
    titulo: "Cambió de estado laboral",
    cambios: [{ campo: "Estado laboral", antes: "Activo", despues: "Vacaciones" }],
    actor: RRHH,
  },
  {
    id: "ev-10",
    fecha: "2025-08-31",
    tipo: "ESTADO",
    titulo: "Cambió de estado laboral",
    cambios: [{ campo: "Estado laboral", antes: "Vacaciones", despues: "Activo" }],
    actor: RRHH,
  },
  {
    id: "ev-11",
    fecha: "2025-10-31",
    tipo: "ASISTENCIA",
    titulo: "Asistencia de octubre de 2025 aprobada",
    descripcion: "El resumen del mes se aprobó sin días por resolver.",
    actor: RRHH,
  },
  {
    id: "ev-12",
    fecha: "2025-12-01",
    tipo: "ROTACION",
    titulo: "Rotación",
    cambios: [
      {
        campo: "Cargo",
        antes: "Analista de Soporte",
        despues: "Jefe de Soporte",
      },
      {
        campo: "Área",
        antes: "Operaciones",
        despues: "Atención al Cliente",
      },
      { campo: "Sueldo básico", antes: "S/ 2,800.00", despues: "S/ 3,500.00" },
    ],
    sinCambios: [
      { campo: "Jornada", valor: "Lunes a sábado, 48 horas" },
      { campo: "Tipo de contrato", valor: "Plazo fijo" },
    ],
    vigenteHasta: "2026-05-03",
    actor: RRHH,
  },
  {
    id: "ev-13",
    fecha: "2026-03-04",
    tipo: "CONTRATO",
    titulo: "Contrato renovado",
    descripcion: "Se renovó el contrato: nuevo plazo indeterminado desde el 04/03/2026.",
    actor: RRHH,
  },
  {
    id: "ev-14",
    fecha: "2026-05-04",
    tipo: "ROTACION",
    titulo: "Modificación",
    cambios: [
      {
        campo: "Jornada",
        antes: "Lunes a sábado, 48 horas",
        despues: "Lunes a viernes, 40 horas",
      },
    ],
    sinCambios: [
      { campo: "Cargo", valor: "Jefe de Soporte" },
      { campo: "Área", valor: "Atención al Cliente" },
      { campo: "Sueldo básico", valor: "S/ 3,500.00" },
    ],
    vigenteHasta: null,
    actor: RRHH,
  },
  {
    id: "ev-15",
    fecha: "2026-09-02",
    tipo: "FINANCIERO",
    titulo: "Datos financieros actualizados",
    descripcion: "Se actualizaron los datos de pensión y las cuentas bancarias.",
    actor: RRHH,
  },
  {
    id: "ev-16",
    fecha: "2026-10-31",
    tipo: "ASISTENCIA",
    titulo: "Asistencia de octubre de 2026 aprobada",
    descripcion: "El resumen del mes se aprobó sin días por resolver.",
    actor: RRHH,
  },
];
