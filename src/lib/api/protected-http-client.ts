import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { publicHttpClient } from "@/lib/api/public-http-client";
/**
 * Funciones que el cliente necesita de la capa de autenticación
 */
interface AuthHandlers {
  getToken: () => string | null;
  // Renueva el token, lo guarda y lo devuelve. Debe compartir la petición en curso
  refreshToken: () => Promise<string>;
  onSessionExpired: () => void;
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let handlers: AuthHandlers | null = null;

// Conecta el cliente con la sesión. Se llama solo una vez al iniciar
export const configureAuth = (nextHandlers: AuthHandlers): void => {
  handlers = nextHandlers;
};

const baseV1URL = import.meta.env.VITE_API_V1_URL;

if (!baseV1URL) throw new Error("Falta configurar VITE_API_V1_URL");

// Reutiliza la URL, timeout y configuración de cookies
export const protectedHttpClient = axios.create(publicHttpClient.defaults);

protectedHttpClient.interceptors.request.use((config) => {
  const token = handlers?.getToken();

  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  else config.headers.delete("Authorization");

  return config;
});

protectedHttpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401 || !error.config)
      return Promise.reject(error);

    const request = error.config as RetryConfig;
    const currentToken = handlers?.getToken();

    // Sin sesión o con un segundo intento fallido, no se vuelve a renovar
    if (!handlers || !currentToken || request._retry)
      return Promise.reject(error);

    request._retry = true;

    // Si otra petición ya renovo el token, solo reintentamos
    if (request.headers.get("Authorization") === `Bearer ${currentToken}`) {
      try {
        await handlers.refreshToken();
      } catch (refreshError) {
        // 401 al renovar significa que la sesion ya no es valida
        if (isAxiosError(refreshError) && refreshError.response?.status === 401)
          handlers.onSessionExpired();

        return Promise.reject(refreshError);
      }
    }

    // El interceptor de salida agrega el token actualizado
    return protectedHttpClient.request(request);
  },
);
