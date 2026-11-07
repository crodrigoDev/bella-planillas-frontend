import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { incidenciasService } from "../services/incidencias.service";
import type { CierreError, CierreProgreso } from "../types/incidencias.types";
import { asistenciaKey } from "./useAsistencia";

/** Colaboradores que se piden al backend por llamada (acepta hasta 100) */
const LOTE_CIERRE = 50;

const PROGRESO_INICIAL: CierreProgreso = {
  lotes: 0,
  procesados: 0,
  errores: [],
};

interface GenerarMesVars {
  periodo: string;
  /** Solo los colaboradores de esta área; sin él, todos */
  areaId?: string;
}

/**
 * Calcula el resumen de todo el mes, lote a lote
 *
 * @returns La mutación (`mutate` inicia el cierre) y el `progreso` acumulado
 *
 * @remarks
 * El backend procesa un lote por llamada y devuelve `siguiente_cursor`: se
 * vuelve a llamar con ese cursor hasta que sea null. No se sabe el total de
 * antemano, así que el avance son lotes, procesados y errores. Si una
 * llamada falla, se corta y se conserva lo avanzado; lo ya calculado queda
 * guardado y el cierre se puede repetir. Al terminar (bien o mal) se refresca
 * la asistencia, porque hubo resúmenes nuevos.
 */
export function useGenerarMes() {
  const queryClient = useQueryClient();
  const [progreso, setProgreso] = useState<CierreProgreso>(PROGRESO_INICIAL);

  const mutation = useMutation({
    mutationFn: async ({ periodo, areaId }: GenerarMesVars) => {
      let acumulado = PROGRESO_INICIAL;
      let cursor: string | undefined;
      setProgreso(acumulado);

      do {
        const lote = await incidenciasService.generarLote({
          periodo,
          area_id: areaId,
          cursor,
          limite: LOTE_CIERRE,
        });
        const fallidos: CierreError[] = lote.detalle.flatMap(
          ({ empleado_id, error }) => (error ? [{ empleado_id, error }] : []),
        );

        acumulado = {
          lotes: acumulado.lotes + 1,
          procesados: acumulado.procesados + lote.total_procesados,
          errores: [...acumulado.errores, ...fallidos],
        };
        setProgreso(acumulado);
        cursor = lote.siguiente_cursor ?? undefined;
      } while (cursor);

      return acumulado;
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: asistenciaKey.all }),
  });

  return { ...mutation, progreso };
}

/**
 * Aprueba todos los resúmenes pendientes del mes
 *
 * @remarks
 * Es todo o nada: si uno no se puede aprobar, el backend no aprueba ninguno.
 * Aprobar uno solo se hace con `useAprobarResumen`.
 */
export function useAprobarMes(periodo: string) {
  return useMutationConAviso({
    mutationFn: () => incidenciasService.aprobarMes(periodo),
    successMessage: ({ registros_aprobados }) =>
      registros_aprobados === 1
        ? "Se aprobó 1 resumen del mes."
        : `Se aprobaron ${registros_aprobados} resúmenes del mes.`,
    invalidate: [asistenciaKey.all],
  });
}
