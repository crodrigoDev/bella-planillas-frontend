import type { LoginDTO } from "@jyp/shared-contracts";
import type { LoginResponse } from "../types/auth.types";
import { createContext } from "react";

/**
 * Datos y operaciones disponibles en el contexto de autenticación
 */
export interface AuthContextValue {
  session: LoginResponse | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
}

/**
 * Comparte la sesión y las operaciones de autenticación
 *
 * @remarks
 * El valor inicial es null para detectar componentes que acceden
 * al contexto sin estar dentro de AuthProvider
 */
export const AuthContext = createContext<AuthContextValue | null>(null);
