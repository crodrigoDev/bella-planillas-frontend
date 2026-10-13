import { isAxiosError } from "axios";
import { authService } from "@/features/auth/services/auth.service";
import type { LoginResponse } from "@/features/auth/types/auth.types";

// Guarda la recuperación en curso para no repetir la misma petición
let pendingRestore: Promise<LoginResponse | null> | null = null;

/**
 * Recupera el acceso y prepara los datos del usuario para la sesión
 *
 * @returns La sesión recuperada o null cuando el servidor responde con 401
 * @throws Si ocurre otro error, como una falla en el servidor
 */
async function requestSession(): Promise<LoginResponse | null> {
  try {
    // Usa la cookie guardada en el navegador para recuperar el acceso
    const { accessToken } = await authService.refresh();

    // Consulta los datos del usuario con el acceso recuperado
    const profile = await authService.profile(accessToken);

    // El perfil tiene otra estructura, por eso ordenamos sus datos aqui
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

    // Los demas errores se muestran para que el usuario pueda reintentar
    throw error;
  }
}

/**
 * Reutiliza la recuperación si ya hay una petición en curso
 *
 * @returns La sesión recuperada o null si hace falta iniciar sesión
 * @throws Si no se puede completar la recuperación
 */
export function restoreSession(): Promise<LoginResponse | null> {
  if (!pendingRestore) {
    pendingRestore = requestSession().finally(() => {
      // Libera la petición terminada para permitir otro intento
      pendingRestore = null;
    });
  }

  return pendingRestore;
}
