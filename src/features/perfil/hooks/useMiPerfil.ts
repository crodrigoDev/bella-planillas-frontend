import { useQuery } from "@tanstack/react-query";

import { perfilService } from "../services/perfil.service";

/** Claves de caché del perfil */
export const perfilKey = {
  me: ["perfil", "me"] as const,
};

/** Obtiene el perfil del usuario con sesión */
export function useMiPerfil() {
  return useQuery({
    queryKey: perfilKey.me,
    queryFn: perfilService.me,
  });
}
