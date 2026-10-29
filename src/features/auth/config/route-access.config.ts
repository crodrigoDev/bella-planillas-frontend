import { ROUTE_PATHS } from "@/app/routes/path";
import type { AuthRol } from "@/features/auth/types/auth.types";

const RRHH: AuthRol = "RRHH";

// null permite el acceso a cualquier usuario autenticado
// Los permisos de consulta siguen los roles declarados en el backend
const ROUTE_ROLES: Readonly<Record<string, readonly AuthRol[] | null>> = {
  [ROUTE_PATHS.dashboard]: null,
  [ROUTE_PATHS.perfil]: null,
  [ROUTE_PATHS.gestionPersonal.empleados]: [RRHH],
  [ROUTE_PATHS.gestionPersonal.nuevoEmpleado]: [RRHH],
  [ROUTE_PATHS.gestionPersonal.detalleEmpleado]: [RRHH],
  [ROUTE_PATHS.gestionPersonal.solicitudes]: [RRHH],
  [ROUTE_PATHS.organizacion.areas]: [RRHH],
  [ROUTE_PATHS.organizacion.cargos]: [RRHH],
  [ROUTE_PATHS.asistencia.jornadas]: [RRHH],
  // Estas dos pantallas quedan solo para RRHH por ahora
  [ROUTE_PATHS.asistencia.marcaciones]: [RRHH],
  [ROUTE_PATHS.auditoria]: [RRHH],
};

/** Comprueba si el rol puede abrir una ruta registrada */
export function canAccessRoute(path: string, role: AuthRol): boolean {
  const allowedRoles = ROUTE_ROLES[path];

  // Una ruta sin configurar no recibe acceso por defecto
  return allowedRoles === null || Boolean(allowedRoles?.includes(role));
}
