import { useQuery, useQueryClient } from "@tanstack/react-query";

import { empleadosService } from "../services/empleados.service";
import type { Empleado, EmpleadosPage } from "../types/empleados.types";
import { empleadosKey } from "./useEmpleados";

/**
 * Obtiene un empleado por su id, para la ficha
 *
 * @param id - Id del empleado; sin id no se consulta
 * @returns La consulta; `data` es null si el empleado no existe
 *
 * @remarks
 * Si el empleado ya está en alguna página cargada del listado, se muestra
 * al instante mientras llega el dato actualizado.
 */
export function useEmpleado(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: empleadosKey.detail(id ?? ""),
    queryFn: () => empleadosService.getById(id as string),
    enabled: Boolean(id),
    placeholderData: (): Empleado | undefined => {
      const pages = queryClient.getQueriesData<EmpleadosPage>({
        queryKey: ["empleados", "list"],
      });

      for (const [, page] of pages) {
        const found = page?.items.find((empleado) => empleado.id === id);

        if (found) return found;
      }
    },
  });
}
