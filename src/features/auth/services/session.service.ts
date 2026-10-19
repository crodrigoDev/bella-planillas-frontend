import { isAxiosError } from "axios";
import { authService } from "@/features/auth/services/auth.service";
import type { LoginResponse } from "@/features/auth/types/auth.types";

// Guarda la recuperación en curso para no repetir la misma petición
let pendingRefresh: Promise<string> | null = null;

/**
 * Renueva el token de acceso mediante la cookie refresh
 *
 * @returns El nuevo token de acceso
 * @throws Si el servidor rechaza la petición o falla la conexión
 */
export const refreshAccessToken = (): Promise<string> => {
  if (!pendingRefresh) {
    pendingRefresh = authService
      .refresh()
      .then(({ accessToken }) => accessToken)
      .finally(() => {
        pendingRefresh = null; // Libera la petición terminada para permitir otro intento
      });
  }

  return pendingRefresh;
};

/**
 * Recupera la sesión completa al abrir esta aplicación
 *
 * @returns La sesión ya recuperada o null cuando el servidor responde con 401
 * @throws Si ocurre otro error como una falla del servidor
 */
export const restoreSession = async (): Promise<LoginResponse | null> => {
  try {
    const accessToken = await refreshAccessToken();
    const profile = await authService.profile(accessToken);

    return {
      accessToken,
      usuario: {
        id: profile.id,
        email: profile.email,
        rol: profile.rol,
        nombre: profile.empleado?.nombre_completo ?? profile.email,
        nro_documento: profile.empleado?.nro_documento ?? null,
      },
    };
  } catch (error) {
    // Si la sesión ya no es válida, dejamos que se muestre el login
    if (isAxiosError(error) && error.response?.status === 401) return null;

    throw error;
  }
};
