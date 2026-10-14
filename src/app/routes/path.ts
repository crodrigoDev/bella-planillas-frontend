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
    crearEmpleado: "/empleados/crear",
    editarEmpleado: "/empleados/:empleadoId/editar",
    importarEmpleados: "/empleados/importar",
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
