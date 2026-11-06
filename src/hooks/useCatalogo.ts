import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ROOT_KEYS } from "@/lib/queryKeys.config";

// Los catálogos casi no cambian: se reutilizan por 30 minutos
const CATALOGO_STALE_TIME = 30 * 60_000;

interface UseCatalogoOptions {
  staleTime?: number;
  keepPrevious?: boolean;
}

/**
 * Consulta un catálogo (lista de opciones para un Select) y lo guarda en caché
 *
 * @param key - Identifica el catálogo; va después de `"catalogos"` en la caché
 * @param queryFn - Pide el catálogo al servicio
 * @param options.staleTime - Cuánto tiempo se reutiliza antes de volver a pedirlo
 * @param options.keepPrevious - Mantiene la lista anterior mientras llega la nueva (para búsquedas)
 */
export function useCatalogo<T>(
  key: readonly unknown[],
  queryFn: () => Promise<T>,
  { staleTime = CATALOGO_STALE_TIME, keepPrevious = false }: UseCatalogoOptions = {},
) {
  return useQuery({
    queryKey: [...ROOT_KEYS.catalogos, ...key],
    queryFn,
    staleTime,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  });
}
