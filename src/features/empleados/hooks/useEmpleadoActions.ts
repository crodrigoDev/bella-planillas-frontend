import type {
  CambiarEstadoLaboralDto,
  DesactivarEmpleadoDto,
} from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
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
  return useMutationConAviso({
    mutationFn: ({
      empleado,
      dto,
    }: {
      empleado: Empleado;
      dto: CambiarEstadoLaboralDto;
    }) => empleadosService.cambiarEstadoLaboral(empleado.id, dto),
    successMessage: (_, { empleado, dto }) => {
      const estado = ESTADO_LABORAL_OPTIONS.find(
        (option) => option.value === dto.estado_laboral,
      );

      return `El estado de ${getNombreCompleto(empleado)} cambió a ${estado?.label ?? dto.estado_laboral}.`;
    },
    invalidate: [empleadosKey.all],
  });
}

/**
 * Da de baja a un empleado, avisa y refresca el listado
 */
export function useDesactivarEmpleado() {
  return useMutationConAviso({
    mutationFn: ({
      empleado,
      dto,
    }: {
      empleado: Empleado;
      dto?: DesactivarEmpleadoDto;
    }) => empleadosService.desactivar(empleado.id, dto),
    successMessage: (_, { empleado }) =>
      `${getNombreCompleto(empleado)} fue dado de baja.`,
    invalidate: [empleadosKey.all],
  });
}

/**
 * Reactiva a un empleado dado de baja, avisa y refresca el listado
 */
export function useReactivarEmpleado() {
  return useMutationConAviso({
    mutationFn: (empleado: Empleado) => empleadosService.reactivar(empleado.id),
    successMessage: (_, empleado) =>
      `${getNombreCompleto(empleado)} fue reactivado.`,
    invalidate: [empleadosKey.all],
  });
}
