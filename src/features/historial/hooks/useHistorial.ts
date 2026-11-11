import { useInfiniteQuery } from "@tanstack/react-query";

import { historialService } from "../services/historial.service";

/** Claves de caché del historial */
export const historialKey = {
  all: ["historial"] as const,
  registro: (tabla: string, registroId: string) =>
    ["historial", tabla, registroId] as const,
};

/**
 * Obtiene el historial de un registro por páginas, para "Cargar más"
 *
 * @param tabla - Tabla del registro, por ejemplo `empleados`
 * @param registroId - Id del registro; sin id no se consulta
 *
 * @remarks
 * Sin tiempo de frescura: al volver a la pestaña se consulta de nuevo, así se
 * ven los cambios hechos desde otras pantallas.
 */
export function useHistorial(tabla: string, registroId: string | undefined) {
  return useInfiniteQuery({
    queryKey: historialKey.registro(tabla, registroId ?? ""),
    queryFn: ({ pageParam }) =>
      historialService.list(tabla, registroId as string, pageParam),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
    enabled: Boolean(registroId),
    staleTime: 0,
  });
}
