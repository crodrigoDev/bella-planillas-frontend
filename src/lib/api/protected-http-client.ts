import axios, {
  isAxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { publicHttpClient } from "./public-http-client";
import { restoreSession } from "@/features/auth/services/recuperar-sesion";
import type { LoginResponse } from "@/features/auth/types/auth.types";

interface AuthConnection {
  getSession: () => LoginResponse | null;
  saveSession: (session: LoginResponse | null) => void;
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Permite leer y actualizar la sesión del provider
let auth: AuthConnection | null = null;

/** Conecta el cliente con la sesión y devuelve una función para desconectarlo */
export function connectAuthClient(connection: AuthConnection) {
  auth = connection;

  return () => {
    if (auth === connection) auth = null;
  };
}

// Reutiliza la URL, timeout y configuración de cookies
export const protectedHttpClient = axios.create(publicHttpClient.defaults);

protectedHttpClient.interceptors.request.use((config) => {
  const token = auth?.getSession()?.accessToken;

  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  else config.headers.delete("Authorization");

  return config;
});

protectedHttpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }

    const request = error.config as RetryConfig;
    const connection = auth;
    const session = connection?.getSession();

    if (!connection || !session) return Promise.reject(error);

    const usedToken = request.headers.get("Authorization");
    const currentToken = `Bearer ${session.accessToken}`;

    // Si el segundo intento falla, termina sin volver a renovar
    if (request._retry) {
      if (usedToken === currentToken) connection.saveSession(null);

      return Promise.reject(error);
    }

    request._retry = true;

    // Si otra petición ya renovó el token, usamos ese acceso
    if (usedToken === currentToken) {
      const restoredSession = await restoreSession();

      if (auth !== connection) return Promise.reject(error);

      // Evita reemplazar una sesión que cambió mientras esperabamos
      if (connection.getSession() === session) {
        connection.saveSession(restoredSession);
      }
    }

    if (!connection.getSession()) return Promise.reject(error);

    // El interceptor de salida agrega el token actualizado
    return protectedHttpClient.request(request);
  },
);
