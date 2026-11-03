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
    editarEmpleado: "/empleados/:id/editar",
    editarDatosFinancieros: "/empleados/:id/editar-datos-financieros",
    detalleEmpleadoContratos: "/empleados/:id/contratos",
    detalleEmpleadoDerechohabientes: "/empleados/:id/derechohabientes",
    detalleEmpleadoAsistencia: "/empleados/:id/asistencia",
    detalleEmpleadoHistorial: "/empleados/:id/historial",
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

/**
 * Arma la ruta de la ficha de un empleado
 *
 * @param section - Pestaña de la ficha ("contratos"); sin ella, la pestaña Información
 */
export const buildEmpleadoPath = (id: string, section?: string): string =>
  `${ROUTE_PATHS.gestionPersonal.empleados}/${id}${section ? `/${section}` : ""}`;

/**
 * Arma la ruta de la edición de un empleado
 */
export const buildEditarEmpleadoPath = (id: string): string =>
  buildEmpleadoPath(id, "editar");

/**
 * Arma la ruta de los datos financieros de un empleado (registro o edición)
 */
export const buildEditarDatosFinancierosPath = (id: string): string =>
  buildEmpleadoPath(id, "editar-datos-financieros");
