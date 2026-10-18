import { create } from "zustand";
import type { LoginDTO } from "@jyp/shared-contracts";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import type {
  AuthInitializationState,
  LoginResponse,
} from "@/features/auth/types/auth.types";
import { restoreSession } from "@/features/auth/services/session.service";
import { authService } from "@/features/auth/services/auth.service";

interface AuthState {
  session: LoginResponse | null;
  initialization: AuthInitializationState;
  bootstrap: () => Promise<void>;
  retryInitialization: () => void;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Guarda la sesión en memoria y las operaciones para cambiarla
 *
 * @remarks
 * El token nunca se persiste: se pierde al cerrar la pestaña
 * y se recupera con la cookie refresh
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  initialization: { status: "loading" },

  /**
   * Busca una sesión guardada al abrir la aplicación
   */
  bootstrap: async () => {
    try {
      const restored = await restoreSession();

      if (get().initialization.status !== "loading") return;

      set({ session: restored, initialization: { status: "ready" } });
    } catch (error) {
      if (get().initialization.status !== "loading") return;

      set({
        initialization: { status: "error", message: getApiErrorMessage(error) },
      });
    }
  },

  /**
   * Vuelve a comprobar la sesión cuando el usuario presiona Reintentar
   */
  retryInitialization: () => {
    set({ initialization: { status: "loading" } });
    void get().bootstrap();
  },

  login: async (credentials) => {
    const session = await authService.login(credentials);

    set({ session, initialization: { status: "ready" } });
  },

  logout: async () => {
    const session = get().session;

    if (!session) return;

    // Conserva la sesión si falla la petición para poder volver a intentar
    await authService.logout(session.accessToken);

    set({ session: null });
  },
}));
