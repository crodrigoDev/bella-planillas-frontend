import { useQuery } from "@tanstack/react-query";

import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { novedadesService } from "../services/novedades.service";
import type { NovedadesFilters } from "../types/novedades.types";

/**
 * Claves de caché de la feature novedades
 */
export const novedadesKey = {
  all: ROOT_KEYS.novedades,
  lists: () => [...ROOT_KEYS.novedades, "list"] as const,
  list: (filters: NovedadesFilters) =>
    [...ROOT_KEYS.novedades, "list", filters] as const,
};

/**
 * Obtiene las novedades de un colaborador en un mes concreto
 *
 * @remarks
 * Solo consulta cuando existen colaborador y mes, porque el backend exige ambos.
 */
export function useNovedades(filters: NovedadesFilters | null) {
  const empleadoId = filters?.empleadoId ?? "";
  const periodo = filters?.periodo ?? "";
  const enabled = Boolean(empleadoId && periodo);

  return useQuery({
    queryKey: novedadesKey.list({ empleadoId, periodo }),
    queryFn: () => novedadesService.listar({ empleadoId, periodo }),
    enabled,
  });
}
