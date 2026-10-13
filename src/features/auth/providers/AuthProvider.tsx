import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthInitializationState, LoginResponse } from "../types/auth.types";
import type { LoginDTO } from "@jyp/shared-contracts";
import { authService } from "../services/auth.service";
import { AuthContext } from "../context/auth.context";
import { restoreSession } from "../services/recuperar-sesion";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { connectAuthClient } from "@/lib/api/protected-http-client";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Recupera la sesión al abrir la aplicación y la comparte con sus componentes
 *
 * @remarks
 * Comprueba la sesión en segundo plano y deja que cada ruta decida que mostrar
 * Los datos se conservan en memoria mientras la aplicación esté abierta
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Permite limpiar los datos guardados de las consultas al salir
  const queryClient = useQueryClient();

  // Guarda el acceso y los datos del usuario que inició sesión
  const [session, setSession] = useState<LoginResponse | null>(null);

  // Permite leer la sesión actual desde los interceptores
  const sessionRef = useRef<LoginResponse | null>(null);

  // Permite ignorar una recuperación anterior a un cambio de sesión
  const sessionVersionRef = useRef(0);

  /** Actualiza el acceso para las peticiones y los datos que muestra React */
  const saveSession = useCallback((nextSession: LoginResponse | null): void => {
    sessionVersionRef.current += 1;
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

  // Comparte el estado de la comprobación con las rutas protegidas
  const [initialization, setInitialization] =
    useState<AuthInitializationState>({ status: "loading" });

  // Al cambiar este numero, se vuelve a comprobar la sesión
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Permite usar el resultado solo mientras esta comprobación siga vigente
    let active = true;
    const sessionVersion = sessionVersionRef.current;

    /**
     * Busca una sesión guardada y actualiza lo que mostramos en pantalla
     */
    const initializeSession = async (): Promise<void> => {
      try {
        const restoredSession = await restoreSession();

        // Ignora el resultado si el usuario ya inició o cerró sesión
        if (!active || sessionVersionRef.current !== sessionVersion) return;

        // null tambien es un resultado válido y permite mostrar el login
        saveSession(restoredSession);
        setInitialization({ status: "ready" });
      } catch (error) {
        if (!active || sessionVersionRef.current !== sessionVersion) return;

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
    setInitialization({ status: "ready" });
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

  return (
    <AuthContext.Provider
      value={{
        session: session,
        isAuthenticated: session !== null,
        initialization,
        retryInitialization,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
