import { useEffect, useRef } from "react";
import type { GenerarPlanillasDto } from "@jyp/shared-contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { planillasService } from "../services/planillas.service";
import { esEstadoTrabajoFinal } from "../utils/planillas.utils";
import { planillasKey } from "./usePlanillas";

/** Intervalo en milisegundos entre consultas mientras el cálculo sigue activo */
export const INTERVALO_CONSULTA_MS = 2000;

/**
 * Solicita la generación de planillas para un período
 */
export function useGenerarPlanillas() {
  return useMutation({
    mutationFn: (dto: GenerarPlanillasDto) => planillasService.generar(dto),
  });
}

/**
 * Consulta periódicamente el avance de una generación de planillas
 *
 * @param trabajoId - Identificador de la solicitud en curso, o `null` si no hay ninguna
 *
 * @remarks
 * Se detiene automáticamente al llegar a un estado final o ante un error 404.
 * Ante errores pasajeros sigue consultando en el mismo intervalo.
 * Cuando el cálculo finaliza correctamente, refresca el listado de planillas una sola vez.
 */
export function useTrabajoPlanillas(trabajoId: string | null) {
  const queryClient = useQueryClient();
  const invalidadoRef = useRef<string | null>(null);

  const query = useQuery({
    queryKey: planillasKey.trabajo(trabajoId ?? ""),
    queryFn: () => planillasService.consultarTrabajo(trabajoId as string),
    enabled: Boolean(trabajoId),
    retry: (failureCount, error) =>
      !(isAxiosError(error) && error.response?.status === 404) &&
      failureCount < 2,
    refetchInterval: (consulta) => {
      const error = consulta.state.error;
      if (isAxiosError(error) && error.response?.status === 404) return false;

      const estado = consulta.state.data?.estado;

      return estado && esEstadoTrabajoFinal(estado)
        ? false
        : INTERVALO_CONSULTA_MS;
    },
  });

  const trabajo = query.data;
  const terminado = trabajo ? esEstadoTrabajoFinal(trabajo.estado) : false;

  useEffect(() => {
    if (!trabajo || !terminado) return;
    if (trabajo.estado !== "completed") return;
    if (invalidadoRef.current === trabajo.trabajo_id) return;

    invalidadoRef.current = trabajo.trabajo_id;
    void queryClient.invalidateQueries({ queryKey: planillasKey.all });
  }, [trabajo, terminado, queryClient]);

  return query;
}
