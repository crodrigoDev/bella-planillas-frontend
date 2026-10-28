import type {
  LoginDTO,
  RestablecerPasswordDTO,
  SolicitudRecuperacionDTO,
} from "@jyp/shared-contracts";
import { publicHttpClient } from "@/lib/api/public-http-client";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type {
  LoginResponse,
  AuthProfileResponse,
  RefreshResponse,
  PasswordRecoveryResponse,
  PasswordResetResponse,
} from "@/features/auth/types/auth.types";
import { protectedHttpClient } from "@/lib/api/protected-http-client";

/**
 * Agrupa las operaciones de autenticación que se comunican con el backend
 *
 * @remarks
 * Cada método realiza una petición HTTP y devuelve un resultado
 * El estado de la sesión se administra fuera de este servicio
 */
export const authService = {
  /**
   * Envía las credenciales al backend para iniciar sesión
   *
   * @param credentials - Credenciales validadas por el formulario
   * @returns El token de acceso y los datos del usuario
   */
  login: async (credentials: LoginDTO): Promise<LoginResponse> => {
    const response = await publicHttpClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials,
    );

    // Axios contiene el cuerpo en response.data y
    // el backend lo contiene en data
    return response.data.data;
  },

  /**
   * Solicita el cierre de sesión y deja que el servidor borre la cookie
   *
   * @throws Si no se puede completar el cierre de sesión
   */
  logout: async (): Promise<void> => {
    // Envia el acceso en los encabezados y la cookie viaja con la petición
    await protectedHttpClient.post("/auth/logout");
  },

  /**
   * Solicita un nuevo token de acceso utilizando la cookie de refresco
   *
   * @returns El nuevo token de acceso
   * @throws Si la petición falla o la sesión ya no es válida
   */
  refresh: async (): Promise<RefreshResponse> => {
    const response =
      await publicHttpClient.post<ApiResponse<RefreshResponse>>(
        "/auth/refresh",
      );

    return response.data.data;
  },

  /**
   * Obtiene el perfil del usuario autenticado mediante su token de acceso
   *
   * @param accessToken - Token que autoriza la consulta del perfil
   * @returns Los datos del perfil autenticado
   * @throws Si la petición falla o el token no es válido
   */
  profile: async (accessToken: string): Promise<AuthProfileResponse> => {
    const response = await publicHttpClient.get<
      ApiResponse<AuthProfileResponse>
    >("/usuarios/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  },

  /**
   * Solicita instrucciones de recuperación usando el documento del usuario
   *
   * @param values - Número de documento del usuario
   * @return Mensaje
   */
  requestPasswordRecovery: async (
    values: SolicitudRecuperacionDTO,
  ): Promise<PasswordRecoveryResponse> => {
    const response = await publicHttpClient.post<
      ApiResponse<PasswordRecoveryResponse>
    >("/auth/recuperar-password", values);

    return response.data.data;
  },

  /**
   * Cambia la contraseña usando el token que llego al correo
   *
   * @param values - Nueva contraseña y el token compuesto
   * @returns Mensaje
   */
  resetPassword: async (
    values: RestablecerPasswordDTO,
  ): Promise<PasswordResetResponse> => {
    const response = await publicHttpClient.post<
      ApiResponse<PasswordResetResponse>
    >("/auth/restablecer-password", values);

    return response.data.data;
  },
};
