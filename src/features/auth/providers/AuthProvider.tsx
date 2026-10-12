import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { LoginResponse } from "../types/auth.types";
import type { LoginDTO } from "@jyp/shared-contracts";
import { authService } from "../services/auth.service";
import { AuthContext } from "../context/auth.context";
import { restoreSession } from "../services/recuperar-sesion";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { connectAuthClient } from "@/lib/api/protected-http-client";

interface AuthProviderProps {
  children: ReactNode;
}

// Indica si seguimos comprobando la sesión, terminamos o hubo un error
type InitializationState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

/**
 * Recupera la sesión al abrir la aplicación y la comparte con sus componentes
 *
 * @remarks
 * Espera a comprobar la sesión antes de mostrar las rutas
 * Los datos se conservan en memoria mientras la aplicación esté abierta
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Permite limpiar los datos guardados de las consultas al salir
  const queryClient = useQueryClient();

  // Guarda el acceso y los datos del usuario que inició sesión
  const [session, setSession] = useState<LoginResponse | null>(null);

  // Permite leer la sesión actual desde los interceptores
  const sessionRef = useRef<LoginResponse | null>(null);

  /** Actualiza el acceso para las peticiones y los datos que muestra React */
  const saveSession = useCallback((nextSession: LoginResponse | null): void => {
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  useEffect(() => {
    return connectAuthClient({
      getSession: () => sessionRef.current,
      saveSession: (nextSession) => {
        saveSession(nextSession);

        // Borra las consultas del usuario si la sesión deja de ser válida
        if (!nextSession) {
          void queryClient.cancelQueries();
          queryClient.clear();
        }
      },
    });
  }, [queryClient, saveSession]);

  // Controla lo que mostramos mientras comprobamos la sesión
  const [initialization, setInitialization] =
    useState<InitializationState>({ status: "loading" });

  // Al cambiar este numero, se vuelve a comprobar la sesión
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Permite usar el resultado solo mientras esta comprobación siga vigente
    let active = true;

    /**
     * Busca una sesión guardada y actualiza lo que mostramos en pantalla
     */
    const initializeSession = async (): Promise<void> => {
      try {
        const restoredSession = await restoreSession();

        if (!active) return;

        // null tambien es un resultado válido y permite mostrar el login
        saveSession(restoredSession);
        setInitialization({ status: "ready" });
      } catch (error) {
        if (!active) return;

        // Guarda un mensaje para mostrarlo junto al boton de reintentar
        setInitialization({
          status: "error",
          message: getApiErrorMessage(error),
        });
      }
    };

    // La función maneja sus errores y no necesitamos esperar aqui
    void initializeSession();

    return () => {
      // Ignora el resultado anterior si esta comprobación ya terminó su ciclo
      active = false;
    };
  }, [attempt, saveSession]);

  /**
   * Vuelve a comprobar la sesión cuando el usuario presiona Reintentar
   */
  const retryInitialization = (): void => {
    setInitialization({ status: "loading" });
    setAttempt((current) => current + 1);
  };

  /**
   * Autentica al usuario y guarda la sesion en memoria
   *
   * @param credentials - Credenciales validadas por el formulario
   * @throws Si el servicio rechaza la petición
   */
  const login = async (credentials: LoginDTO): Promise<void> => {
    const result = await authService.login(credentials);

    // Actualiza la sesión despues de una autenticacion exitosa
    saveSession(result);
  };

  /**
   * Cierra la sesión y borra los datos guardados del usuario
   *
   * @throws Si el servidor no puede confirmar el cierre de sesión
   */
  const logout = async (): Promise<void> => {
    if (!session) return;

    // Conserva la sesión si falla la petición para poder volver a intentar
    await authService.logout(session.accessToken);

    // Detiene las consultas pendientes antes de limpiar sus resultados
    await queryClient.cancelQueries();
    queryClient.clear();

    // Las rutas protegidas detectan este cambio y muestran el login
    saveSession(null);
  };

  // Espera antes de mostrar las rutas para evitar una redirección al login
  if (initialization.status === "loading") {
    return (
      <main className="flex min-h-dvh items-center justify-center gap-3">
        <Spinner aria-label="Comprobando sesión" />
        <p>Comprobando sesión...</p>
      </main>
    );
  }

  // Permite volver a intentar si falla la conexión o responde un error
  if (initialization.status === "error") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p role="alert">{initialization.message}</p>

        <Button type="button" onClick={retryInitialization}>
          Reintentar
        </Button>
      </main>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session: session,
        isAuthenticated: session !== null,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
