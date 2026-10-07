import { ROUTE_PATHS } from "./path";

/**
 * Define las rutas que muestran temporalmente la página de construcción
 */
export const pendingPages = [
  { path: ROUTE_PATHS.gestionPersonal.empleados, title: "Empleados" },
  { path: ROUTE_PATHS.gestionPersonal.solicitudes, title: "Solicitudes" },
  { path: ROUTE_PATHS.organizacion.areas, title: "Áreas" },
  { path: ROUTE_PATHS.organizacion.cargos, title: "Cargos" },
  {
    path: ROUTE_PATHS.asistencia.jornadas,
    title: "Jornadas",
  },
  { path: ROUTE_PATHS.asistencia.marcaciones, title: "Marcaciones" },
  { path: ROUTE_PATHS.auditoria, title: "Auditoría" },
  { path: ROUTE_PATHS.perfil, title: "Mi perfil" },
] as const;
