import type { EditarEmpleadoDto } from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
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
  return useMutationConAviso({
    mutationFn: (dto: EditarEmpleadoDto) => empleadosService.editar(id, dto),
    successMessage: "Los datos del empleado se actualizaron correctamente.",
    invalidate: [empleadosKey.all],
  });
}
