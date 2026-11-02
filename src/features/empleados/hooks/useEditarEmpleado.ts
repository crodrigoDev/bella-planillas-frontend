import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { EditarEmpleadoDto } from "@jyp/shared-contracts";

import { empleadosService } from "../services/empleados.service";
import { empleadosKey } from "./useEmpleados";

/**
 * Guarda los cambios de un empleado, avisa y refresca el listado y la ficha
 *
 * @remarks
 * La mutación sigue pendiente hasta que termina el refresco, así la
 * página de edición se cierra cuando la ficha ya muestra los datos nuevos.
 */
export function useEditarEmpleado(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: EditarEmpleadoDto) => empleadosService.editar(id, dto),
    onSuccess: () => {
      toast.success("Los datos del empleado se actualizaron correctamente.");

      return queryClient.invalidateQueries({ queryKey: empleadosKey.all });
    },
  });
}
