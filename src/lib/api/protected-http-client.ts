import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { publicHttpClient } from "./public-http-client";
import { refreshAccessToken } from "@/features/auth/services/session.service";
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
    if (
      !isAxiosError(error) ||
      error.response?.status !== 401 ||
      !error.config
    ) {
      return Promise.reject(error);
    }

    const request = error.config as RetryConfig;
    const connection = auth;
    const session = connection?.getSession();

    // Sin sesión o con un segundo intento fallido, no renueva la sesión
    if (!connection || !session || request._retry) return Promise.reject(error);

    request._retry = true;

    // Si otra petición ya renovó el token, usamos ese acceso
    if (
      request.headers.get("Authorization") === `Bearer ${session.accessToken}`
    ) {
      try {
        const accessToken = await refreshAccessToken();
        const current = connection.getSession();

        // No revive una sesión ya cerrada mientras esperamos
        if (!current) return Promise.reject(error);

        // Conserva el usuario y solo cambia el token
        if (current.accessToken == accessToken)
          connection.saveSession({ ...current, accessToken });
      } catch (refreshError) {
        // 401 al renovar el token significa que la sesión ya no es válida
        if (isAxiosError(refreshError) && refreshError.response?.status === 401)
          connection.saveSession(null);

        return Promise.reject(refreshError);
      }
    }

    // El interceptor de salida agrega el token actualizado
    return protectedHttpClient.request(request);
  },
);
