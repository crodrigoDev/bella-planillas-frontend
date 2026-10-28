import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CambiarEstadoLaboralDto,
  DesactivarEmpleadoDto,
} from "@jyp/shared-contracts";
import { empleadosService } from "../services/empleados.service";
import { empleadosKey } from "./useEmpleados";

/**
 * Cambia el estado laboral de un empleado y refresca el listado
 *
 * @remarks
 * La mutación sigue pendiente hasta que el listado termina de refrescarse,
 * así el diálogo se cierra cuando la tabla ya muestra el cambio.
 */
export function useCambiarEstadoLaboral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CambiarEstadoLaboralDto }) =>
      empleadosService.cambiarEstadoLaboral(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: empleadosKey.all }),
  });
}

/**
 * Da de baja a un empleado y refresca el listado
 */
export function useDesactivarEmpleado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto?: DesactivarEmpleadoDto }) =>
      empleadosService.desactivar(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: empleadosKey.all }),
  });
}

/**
 * Reactiva a un empleado dado de baja y refresca el listado
 */
export function useReactivarEmpleado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => empleadosService.reactivar(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: empleadosKey.all }),
  });
}
