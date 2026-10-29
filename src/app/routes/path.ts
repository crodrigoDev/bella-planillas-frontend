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
    nuevoEmpleado: "/empleados/nuevo",
    detalleEmpleado: "/empleados/:id",
    solicitudes: "/solicitudes",
  },

  organizacion: {
    areas: "/areas",
    cargos: "/cargos",
  },

  asistencia: {
    jornadas: "/jornadas",
    marcaciones: "/marcaciones",
  },

  auditoria: "/auditoria",

  perfil: "/perfil",
} as const;

/** Arma la ruta de la ficha de un empleado */
export const buildEmpleadoPath = (id: string): string =>
  `${ROUTE_PATHS.gestionPersonal.empleados}/${id}`;
