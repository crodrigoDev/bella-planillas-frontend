/**
 * Roles que puede devolver el backend para un usuario
 */
export type AuthRol =
  | "ADMIN"
  | "CONTADOR"
  | "RRHH"
  | "ASISTENTE"
  | "EMPLEADO"
  | "JYP";

/**
 * Datos del usuario devueltos al iniciar sesión
 */
export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  nro_documento: string;
  rol: AuthRol;
}

/**
 * Resultado de un inicio de sesión exitoso
 */
export interface LoginResponse {
  accessToken: string;
  usuario: AuthUser;
}
