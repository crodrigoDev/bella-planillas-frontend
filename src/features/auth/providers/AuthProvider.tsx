import { useState, type ReactNode } from "react";
import type { LoginResponse } from "../types/auth.types";
import type { LoginDTO } from "@jyp/shared-contracts";
import { authService } from "../services/auth.service";
import { AuthContext } from "../context/auth.context";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Administra la sesión y la comparte con sus componentes descendientes
 *
 * @remarks
 * La sesión se conserva en memoria mientras el provider permanezca montado.
 * Los errores de login se propagan al componente que lo solicita
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<LoginResponse | null>(null);

  /**
   * Autentica al usuario y guarda la sesion en memoria
   *
   * @param credentials - Credenciales validadas por el formulario
   * @throws Si el servicio rechaza la petición
   */
  const login = async (credentials: LoginDTO): Promise<void> => {
    const result = await authService.login(credentials);

    // Actualiza la sesión despues de una autenticacion exitosa
    setSession(result);
  };

  return (
    <AuthContext.Provider
      value={{
        session: session,
        isAuthenticated: session !== null,
        login: login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
