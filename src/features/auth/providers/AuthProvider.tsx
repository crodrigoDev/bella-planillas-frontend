import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Recupera la sesión al abrir la aplicación y limpia las consultas al salir
 *
 * @remarks
 * La sesión vive en useAuthStore; este componente solo coordina el arranque
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const hasSession = useAuthStore((state) => state.session !== null);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (hasSession) return;

    void queryClient.cancelQueries();
    queryClient.clear();
  }, [hasSession, queryClient]);

  return <>{children}</>;
}
