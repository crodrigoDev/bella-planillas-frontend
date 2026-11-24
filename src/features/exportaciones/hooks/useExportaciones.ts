import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { exportacionesService } from "../services/exportaciones.service";
import { esEstadoFinal } from "../utils/exportaciones.utils";

/** Intervalo inicial en milisegundos mientras la exportación está en curso */
export const INTERVALO_CONSULTA_MS = 3000;

/** Intervalo reducido en milisegundos cuando la exportación supera los dos minutos */
export const INTERVALO_CONSULTA_LENTO_MS = 15000;

/** Tiempo máximo con consulta rápida antes de espaciar las peticiones */
export const UMBRAL_CONSULTA_LENTA_MS = 2 * 60 * 1000;

/**
 * Claves de caché de la feature exportaciones
 */
export const exportacionesKey = {
  all: ROOT_KEYS.exportaciones,
  detail: (id: string) => [...ROOT_KEYS.exportaciones, "detail", id] as const,
};

/**
 * Consulta periódicamente el estado de una exportación hasta que termina o devuelve 404
 *
 * @param id - Identificador de la exportación en curso, o `null` si no hay ninguna
 *
 * @remarks
 * Consulta cada 3 s al inicio y pasa a 15 s si supera dos minutos sin finalizar.
 * Se detiene automáticamente al alcanzar un estado final o ante un error 404.
 */
export function useExportacion(id: string | null) {
  return useQuery({
    queryKey: exportacionesKey.detail(id ?? ""),
    queryFn: () => exportacionesService.consultar(id as string),
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      !(isAxiosError(error) && error.response?.status === 404) &&
      failureCount < 2,
    refetchInterval: (consulta) => {
      const error = consulta.state.error;
      if (isAxiosError(error) && error.response?.status === 404) return false;

      const data = consulta.state.data;
      if (data && esEstadoFinal(data.estado)) return false;

      if (data) {
        const creadoMs = Date.parse(data.creado_en);
        if (
          Number.isFinite(creadoMs) &&
          Date.now() - creadoMs > UMBRAL_CONSULTA_LENTA_MS
        ) {
          return INTERVALO_CONSULTA_LENTO_MS;
        }
      }

      return INTERVALO_CONSULTA_MS;
    },
  });
}
