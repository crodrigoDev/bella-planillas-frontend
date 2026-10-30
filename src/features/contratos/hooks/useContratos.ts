import { useQuery } from "@tanstack/react-query";

import { contratosService } from "../services/contratos.service";

/** Claves de caché de contratos */
export const contratosKey = {
  all: ["contratos"] as const,
  byEmpleado: (empleadoId: string) =>
    ["contratos", "empleado", empleadoId] as const,
};

/** Contratos de un empleado, para la pestaña Contratos de la ficha */
export function useContratosEmpleado(empleadoId: string) {
  return useQuery({
    queryKey: contratosKey.byEmpleado(empleadoId),
    queryFn: () => contratosService.listByEmpleado(empleadoId),
  });
}
