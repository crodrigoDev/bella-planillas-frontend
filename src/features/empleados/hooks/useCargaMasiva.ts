import { useEffect, useRef } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { CargaMasivaFilaDTO } from "@jyp/shared-contracts";
import { getApiErrorMessage } from "@/lib/api/apiError.utils";
import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { cargaMasivaService } from "../services/cargaMasiva.service";
import type {
  CargaMasivaEstado,
  CargaMasivaTrabajo,
} from "../types/cargaMasiva.types";

/** Cada cuántos milisegundos se pregunta el avance mientras el trabajo no termina */
export const INTERVALO_CONSULTA_MS = 2000;

/**
 * Claves de caché de la importación masiva
 *
 * @remarks
 * No cuelgan de `ROOT_KEYS.empleados`: al terminar se refresca la lista de
 * empleados y no hace falta volver a consultar el trabajo.
 */
export const cargaMasivaKey = {
  all: ["carga-masiva"] as const,
  estado: (jobId: string) => ["carga-masiva", "estado", jobId] as const,
};

const ESTADOS_FINALES: readonly CargaMasivaEstado[] = [
  "COMPLETADO",
  "FALLIDO",
];

/** Indica si el trabajo ya terminó (no se vuelve a consultar) */
export const esEstadoFinal = (estado: CargaMasivaEstado): boolean =>
  ESTADOS_FINALES.includes(estado);

/** Descarga la plantilla de Excel y avisa si falla */
export function useDescargarPlantilla() {
  return useMutation({
    mutationFn: () => cargaMasivaService.descargarPlantilla(),
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

/** Revisa el archivo sin guardar nada; el error lo muestra quien la usa */
export function useValidarCargaMasiva() {
  return useMutation({
    mutationFn: (file: File) => cargaMasivaService.validar(file),
  });
}

/** Manda a guardar las filas válidas; devuelve el id del trabajo */
export function useConfirmarCargaMasiva() {
  return useMutation({
    mutationFn: (filas: CargaMasivaFilaDTO[]) =>
      cargaMasivaService.confirmar(filas),
  });
}

const getResumen = (trabajo: CargaMasivaTrabajo): string => {
  const { procesados, fallidos } = trabajo;

  if (trabajo.estado === "FALLIDO")
    return "No se pudo importar ningún empleado.";
  if (fallidos === 0) return `Se importaron ${procesados} empleados.`;

  return `Se importaron ${procesados} empleados y ${fallidos} no se pudieron guardar.`;
};

/**
 * Consulta el avance de un trabajo de importación
 *
 * @param jobId - Id del trabajo, o null si todavía no hay uno
 *
 * @remarks
 * Consulta cada 2 segundos mientras está en cola o procesando y se detiene al
 * llegar a un estado final o si la consulta falla. Si el trabajo termina con la
 * página abierta, avisa con un solo toast y refresca la lista de empleados. Un 404
 * (no existe o es de otro usuario) no se reintenta.
 */
export function useEstadoCargaMasiva(jobId: string | null) {
  const queryClient = useQueryClient();
  const avisado = useRef<string | null>(null);
  // Trabajo que se vio en cola o procesando mientras la página estaba abierta
  const vioEnCurso = useRef<string | null>(null);

  const query = useQuery({
    queryKey: cargaMasivaKey.estado(jobId ?? ""),
    queryFn: () => cargaMasivaService.getEstado(jobId as string),
    enabled: jobId !== null,
    retry: (failureCount, error) =>
      !(isAxiosError(error) && error.response?.status === 404) &&
      failureCount < 2,
    refetchInterval: (consulta) => {
      // Si la consulta falló (por ejemplo un 404) no se sigue preguntando
      if (consulta.state.status === "error") return false;

      const estado = consulta.state.data?.estado;

      return estado && esEstadoFinal(estado) ? false : INTERVALO_CONSULTA_MS;
    },
  });

  const trabajo = query.data;
  const terminado = trabajo ? esEstadoFinal(trabajo.estado) : false;

  useEffect(() => {
    if (!trabajo) return;

    // Al abrir un trabajo que ya había terminado (recarga) no se vuelve a avisar
    if (!terminado) {
      vioEnCurso.current = trabajo.id;
      return;
    }
    if (vioEnCurso.current !== trabajo.id || avisado.current === trabajo.id)
      return;

    avisado.current = trabajo.id;

    if (trabajo.estado === "FALLIDO") toast.error(getResumen(trabajo));
    else toast.success(getResumen(trabajo));

    void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.empleados });
  }, [trabajo, terminado, queryClient]);

  return query;
}
