import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CambiarEstadoLaboralDto,
  DesactivarEmpleadoDto,
} from "@jyp/shared-contracts";
import { ESTADO_LABORAL_OPTIONS } from "../config/empleados.config";
import { empleadosService } from "../services/empleados.service";
import type { Empleado } from "../types/empleados.types";
import { getNombreCompleto } from "../utils/empleados.utils";
import { empleadosKey } from "./useEmpleados";

/**
 * Cambia el estado laboral de un empleado, avisa y refresca el listado
 *
 * @remarks
 * El aviso se muestra aquí y no en el diálogo: si la fila desaparece al
 * refrescar, el diálogo se desmonta y sus callbacks ya no se ejecutan.
 * La mutación sigue pendiente hasta que el listado termina de refrescarse,
 * así el diálogo se cierra cuando la tabla ya muestra el cambio.
 */
export function useCambiarEstadoLaboral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      empleado,
      dto,
    }: {
      empleado: Empleado;
      dto: CambiarEstadoLaboralDto;
    }) => empleadosService.cambiarEstadoLaboral(empleado.id, dto),
    onSuccess: (_, { empleado, dto }) => {
      const estado = ESTADO_LABORAL_OPTIONS.find(
        (option) => option.value === dto.estado_laboral,
      );

      toast.success(
        `El estado de ${getNombreCompleto(empleado)} cambió a ${estado?.label ?? dto.estado_laboral}.`,
      );

      return queryClient.invalidateQueries({ queryKey: empleadosKey.all });
    },
  });
}

/**
 * Da de baja a un empleado, avisa y refresca el listado
 */
export function useDesactivarEmpleado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      empleado,
      dto,
    }: {
      empleado: Empleado;
      dto?: DesactivarEmpleadoDto;
    }) => empleadosService.desactivar(empleado.id, dto),
    onSuccess: (_, { empleado }) => {
      toast.success(`${getNombreCompleto(empleado)} fue dado de baja.`);

      return queryClient.invalidateQueries({ queryKey: empleadosKey.all });
    },
  });
}

/**
 * Reactiva a un empleado dado de baja, avisa y refresca el listado
 */
export function useReactivarEmpleado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (empleado: Empleado) => empleadosService.reactivar(empleado.id),
    onSuccess: (_, empleado) => {
      toast.success(`${getNombreCompleto(empleado)} fue reactivado.`);

      return queryClient.invalidateQueries({ queryKey: empleadosKey.all });
    },
  });
}
