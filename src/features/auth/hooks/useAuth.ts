import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../context/auth.context";

/**
 * Obtiene la sesión y las operaciones de autenticación
 *
 * @returns El valor proporcionado por AuthProvider
 * @throws Si se utiliza fuera de AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null)
    throw new Error("useAuth debe usarse dentro de AuthProvider");

  return context;
}
