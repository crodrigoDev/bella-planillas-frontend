import { useQuery } from "@tanstack/react-query";

// Los catálogos casi no cambian: se reutilizan por 30 minutos
const CATALOGO_STALE_TIME = 30 * 60_000;

/**
 * Consulta un catálogo (lista de opciones para un Select) y lo guarda en caché
 *
 * @param key - Identifica el catálogo; va después de `"catalogos"` en la caché
 * @param queryFn - Pide el catálogo al servicio
 * @param staleTime - Cuánto tiempo se reutiliza antes de volver a pedirlo
 */
export function useCatalogo<T>(
  key: readonly unknown[],
  queryFn: () => Promise<T>,
  staleTime = CATALOGO_STALE_TIME,
) {
  return useQuery({
    queryKey: ["catalogos", ...key],
    queryFn,
    staleTime,
  });
}
