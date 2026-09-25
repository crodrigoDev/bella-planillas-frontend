import { ROUTE_PATHS } from "./path";

export const pendingPages = [
  { path: ROUTE_PATHS.gestionPersonal.empleados, title: "Empleados" },
  { path: ROUTE_PATHS.gestionPersonal.solicitudes, title: "Solicitudes" },
  {
    path: ROUTE_PATHS.gestionPersonal.movimientosLaborales,
    title: "Movimientos Laborales",
  },
  { path: ROUTE_PATHS.organizacion.areas, title: "Áreas" },
  { path: ROUTE_PATHS.organizacion.cargos, title: "Cargos" },
  {
    path: ROUTE_PATHS.asistenciaTurnos.resumenAsistencia,
    title: "Resumen de asistencia",
  },
  { path: ROUTE_PATHS.asistenciaTurnos.marcaciones, title: "Marcaciones" },
  { path: ROUTE_PATHS.asistenciaTurnos.incidencias, title: "Incidencias" },
  { path: ROUTE_PATHS.asistenciaTurnos.turnos, title: "Turnos" },
  {
    path: ROUTE_PATHS.asistenciaTurnos.asignacionTurnos,
    title: "Asignación de turnos",
  },
  { path: ROUTE_PATHS.perfil, title: "Mi perfil" },
] as const;
