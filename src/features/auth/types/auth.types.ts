import type { LoginDTO, MiPerfilResponseDto } from "@jyp/shared-contracts";

/**
 * Datos y operaciones disponibles en el contexto de autenticación
 */
export interface UseAuthResult {
  session: LoginResponse | null;
  isAuthenticated: boolean;
  initialization: AuthInitializationState;
  retryInitialization: () => void;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Roles que puede devolver el backend para un usuario
 */
export type AuthRol = MiPerfilResponseDto["rol"];

/**
 * Datos del usuario disponibles en la sesión del frontend
 */
export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  // Puede faltar si el perfil no tiene un empleado asociado
  nro_documento: string | null;
  rol: AuthRol;
}

/**
 * Resultado de un inicio de sesión exitoso
 */
export interface LoginResponse {
  accessToken: string;
  usuario: AuthUser;
}

/**
 * Resultado de la renovación del token de acceso
 */
export interface RefreshResponse {
  accessToken: string;
}

/** Mensaje que devuelve el backend al solicitar la recuperación */
export interface PasswordRecoveryResponse {
  message: string;
}

/** Indica como va la comprobación inicial de la sesión */
export type AuthInitializationState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "entering" }
  | { status: "error"; message: string };

/**
 * Datos del perfil tal como llegan desde el servidor
 *
 * @remarks
 * La fecha llega como texto, aunque shared contracts la defina como Date
 */
export type AuthProfileResponse = Omit<MiPerfilResponseDto, "ultimo_acceso"> & {
  ultimo_acceso?: string | null;
};
