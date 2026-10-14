import { ROUTE_PATHS } from "@/app/routes/path";
import type { AuthRol } from "@/features/auth/types/auth.types";

// null permite el acceso a cualquier usuario autenticado
// Los permisos de consulta siguen los roles declarados en el backend
const ROUTE_ROLES: Readonly<Record<string, readonly AuthRol[] | null>> = {
  [ROUTE_PATHS.dashboard]: null,
  [ROUTE_PATHS.perfil]: null,
  [ROUTE_PATHS.gestionPersonal.empleados]: ["ADMIN", "RRHH", "CONTADOR"],
  [ROUTE_PATHS.gestionPersonal.fichaEmpleado]: ["ADMIN", "RRHH", "CONTADOR"],
  [ROUTE_PATHS.gestionPersonal.crearEmpleado]: ["ADMIN", "RRHH"],
  [ROUTE_PATHS.gestionPersonal.editarEmpleado]: ["ADMIN", "RRHH"],
  [ROUTE_PATHS.gestionPersonal.importarEmpleados]: ["ADMIN", "RRHH"],
  [ROUTE_PATHS.gestionPersonal.solicitudes]: [
    "ADMIN",
    "RRHH",
    "EMPLEADO",
    "CONTADOR",
  ],
  [ROUTE_PATHS.organizacion.areas]: ["ADMIN", "RRHH"],
  [ROUTE_PATHS.organizacion.cargos]: ["ADMIN", "RRHH"],
  [ROUTE_PATHS.asistencia.jornadas]: ["ADMIN", "RRHH", "CONTADOR"],
  [ROUTE_PATHS.asistencia.crearJornada]: ["ADMIN", "RRHH"],
  // Estas dos pantallas quedan solo para RRHH por ahora
  [ROUTE_PATHS.asistencia.marcaciones]: ["RRHH"],
  [ROUTE_PATHS.auditoria]: ["RRHH"],
};

/** Comprueba si el rol puede abrir una ruta registrada */
export function canAccessRoute(path: string, role: AuthRol): boolean {
  const allowedRoles = ROUTE_ROLES[path];

  // Una ruta sin configurar no recibe acceso por defecto
  return allowedRoles === null || Boolean(allowedRoles?.includes(role));
}
