import { useAuthStore } from "@/features/auth/store/auth.store";
import type { UseAuthResult } from "@/features/auth/types/auth.types";

/**
 * Obtiene la sesión y las operaciones de autenticación
 *
 * @returns La sesión actual y las acciones para iniciarla o cerrarla
 */
export function useAuth(): UseAuthResult {
  const session = useAuthStore((state) => state.session);
  const initialization = useAuthStore((state) => state.initialization);
  const retryInitialization = useAuthStore(
    (state) => state.retryInitialization,
  );
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    session,
    isAuthenticated: session !== null,
    initialization,
    retryInitialization,
    login,
    logout,
  };
}
