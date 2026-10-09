import type { LoginDTO } from "@jyp/shared-contracts";
import type { LoginResponse } from "../types/auth.types";
import { publicHttpClient } from "@/lib/api/public-http-client";
import type { ApiResponse } from "@/lib/api/types/api.types";

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
};
