import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type { MiPerfil } from "../types/perfil.types";

/**
 * Agrupa las consultas del perfil que se comunican al backend
 */
export const perfilService = {
  /**
   * Consulta el perfil del usuario con sesión
   *
   * @remarks
   * El use case devuelve el objeto directo, pero el interceptor de respuestas
   * del backend lo envuelve en `{ data }` como a las demás.
   */
  me: async (): Promise<MiPerfil> => {
    const response =
      await protectedHttpClient.get<ApiResponse<MiPerfil>>("/usuarios/me");

    return response.data.data;
  },
};
