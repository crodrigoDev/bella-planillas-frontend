import { useInfiniteQuery } from "@tanstack/react-query";

import { HISTORIAL_LIMIT } from "../config/historial.config";
import { auditoriaService } from "../services/auditoria.service";
import type { TipoAfectadoConId } from "../types/auditoria.types";

/** Claves de caché del historial */
export const historialKey = {
  all: ["historial"] as const,
  afectado: (tipo: TipoAfectadoConId, id: string) =>
    ["historial", tipo, id] as const,
};

/**
 * Obtiene la línea de tiempo de un afectado por páginas, para "Cargar más"
 *
 * @param tipo - Tipo de afectado, por ejemplo `empleado`
 * @param id - Id del afectado; sin id no se consulta
 *
 * @remarks
 * Sin tiempo de frescura: al volver a la pestaña se consulta de nuevo, así se
 * ven los cambios hechos desde otras pantallas.
 */
export function useHistorialAfectado(tipo: TipoAfectadoConId, id: string | undefined) {
  return useInfiniteQuery({
    queryKey: historialKey.afectado(tipo, id ?? ""),
    queryFn: ({ pageParam }) =>
      auditoriaService.listAfectado(tipo, id as string, {
        page: pageParam,
        limit: HISTORIAL_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
    enabled: Boolean(id),
    staleTime: 0,
  });
}
