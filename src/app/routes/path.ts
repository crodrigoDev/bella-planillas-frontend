/**
 * Contiene las rutas disponibles dentro de la aplicación.
 */
export const ROUTE_PATHS = {
  root: "/",

  auth: {
    login: "/login",
    recuperarPassword: "/recuperar-password",
    restablecerPassword: "/restablecer-password",
  },

  dashboard: "/dashboard",

  gestionPersonal: {
    empleados: "/empleados",
    solicitudes: "/solicitudes",
    movimientosLaborales: "/movimientos-laborales",
  },

  organizacion: {
    areas: "/areas",
    cargos: "/cargos",
  },

  asistenciaTurnos: {
    resumenAsistencia: "/resumen-asistencia",
    marcaciones: "/marcaciones",
    incidencias: "/incidencias",
    turnos: "/turnos",
    asignacionTurnos: "/asignacion-turnos",
  },

  perfil: "/perfil",
} as const;
