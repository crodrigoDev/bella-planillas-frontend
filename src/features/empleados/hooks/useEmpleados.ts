import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { EmpleadoFilters } from "../types/empleados.types";
import { empleadosService } from "../services/empleados.service";

/**
 * Claves de caché de empleados
 *
 * @remarks
 * Invalida `all` refresca la lista sin importar los filtros que tenga
 */
export const empleadosKey = {
  all: ["empleados"] as const,
  list: (filters: EmpleadoFilters) => ["empleados", "list", filters] as const,
  detail: (id: string) => ["empleados", "detail", id] as const,
};

/**
 * Obtiene una página de empleados según los filtros
 *
 * @param filters - Página, búsqueda y filtros del listado
 * @returns La consulta de TanStack Query con la página actual
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva,
 * así la tabla no parpadea al paginar o filtrar.
 */
export function useEmpleados(filters: EmpleadoFilters) {
  return useQuery({
    queryKey: empleadosKey.list(filters),
    queryFn: () => empleadosService.list(filters),
    placeholderData: keepPreviousData,
  });
}
