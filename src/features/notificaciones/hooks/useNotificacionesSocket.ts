import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { toast } from "sonner";

import { MAX_NOTIFICACIONES } from "../config/notificaciones.config";
import type { Notificacion } from "../types/notificaciones.types";
import { agregarNotificacion } from "../utils/notificaciones.utils";
import { notificacionesKey } from "./useNotificaciones";

const NAMESPACE = "/ws/notificaciones";
const MAX_INTENTOS = 3;
const ESPERA_BASE_MS = 1000;

interface UseNotificacionesSocketOptions {
  /** Devuelve el access token vigente; se lee en cada conexión */
  getToken: () => string | null;
  /** Renueva el access token y lo devuelve; falla si la sesión terminó */
  renovarToken: () => Promise<string>;
  /** Sin sesión no se conecta */
  enabled: boolean;
}

/** Muestra el aviso de una alerta nueva con el color de su tipo */
const avisar = ({ tipo, titulo, mensaje }: Notificacion) => {
  const mostrar =
    tipo === "ERROR"
      ? toast.error
      : tipo === "WARNING"
        ? toast.warning
        : tipo === "SUCCESS"
          ? toast.success
          : toast.info;

  mostrar(titulo, { description: mensaje });
};

/**
 * Mantiene la conexión en tiempo real con las notificaciones y las lleva a la caché
 *
 * @remarks
 * El servidor corta el socket cuando vence el access token (`io server
 * disconnect`, que Socket.IO no reintenta solo) y rechaza la conexión con
 * "No autorizado" si llega con uno vencido. En ambos casos se renueva el token
 * y se reconecta, con un tope de intentos para no entrar en bucle.
 * El origen es el del backend sin `/api/v1`.
 *
 * @returns `conectado`: si el tiempo real está activo ahora
 */
export function useNotificacionesSocket({
  getToken,
  renovarToken,
  enabled,
}: UseNotificacionesSocketOptions) {
  const queryClient = useQueryClient();
  const [conectado, setConectado] = useState(false);

  // Las funciones se leen desde la referencia para no reconectar si cambian
  const funcionesRef = useRef({ getToken, renovarToken });
  useEffect(() => {
    funcionesRef.current = { getToken, renovarToken };
  });

  useEffect(() => {
    if (!enabled) return;

    const origen = new URL(import.meta.env.VITE_API_URL as string).origin;
    const socket = io(`${origen}${NAMESPACE}`, {
      // Función: cada reconexión lleva el token que haya en ese momento
      auth: (cb) => cb({ token: funcionesRef.current.getToken() }),
    });

    let cerrado = false;
    let intentos = 0;
    let espera: ReturnType<typeof setTimeout> | undefined;

    const recuperar = () => {
      if (cerrado || espera || intentos >= MAX_INTENTOS) return;

      intentos += 1;
      espera = setTimeout(async () => {
        espera = undefined;
        try {
          await funcionesRef.current.renovarToken();
        } catch {
          return; // Sin sesión válida no se reconecta
        }
        if (!cerrado) socket.connect();
      }, ESPERA_BASE_MS * intentos);
    };

    socket.on("connect", () => setConectado(true));
    socket.on("disconnect", (reason) => {
      setConectado(false);
      if (reason === "io server disconnect") recuperar();
    });
    socket.on("connect_error", (error) => {
      setConectado(false);
      if (error.message.includes("No autorizado")) recuperar();
    });

    socket.on("notificacionesIniciales", (lista: Notificacion[]) => {
      intentos = 0; // La conexión funcionó: se reinicia el tope
      queryClient.setQueryData<Notificacion[]>(
        notificacionesKey.all,
        lista.slice(0, MAX_NOTIFICACIONES),
      );
    });

    socket.on("nuevaNotificacion", (nueva: Notificacion) => {
      const actuales =
        queryClient.getQueryData<Notificacion[]>(notificacionesKey.all) ?? [];
      const yaEstaba = actuales.some((item) => item.id === nueva.id);

      queryClient.setQueryData<Notificacion[]>(
        notificacionesKey.all,
        agregarNotificacion(actuales, nueva),
      );
      if (!yaEstaba) avisar(nueva);
    });

    return () => {
      cerrado = true;
      clearTimeout(espera);
      socket.removeAllListeners();
      socket.disconnect();
      setConectado(false);
    };
  }, [enabled, queryClient]);

  return { conectado };
}
