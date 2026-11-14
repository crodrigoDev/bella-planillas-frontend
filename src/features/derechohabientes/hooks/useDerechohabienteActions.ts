import type {
  RegistrarDerechohabienteDto,
  SubirSustentoDerechohabienteDto,
} from "@jyp/shared-contracts";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { getApiErrorMessage } from "@/lib/api/apiError.utils";
import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { derechohabientesService } from "../services/derechohabientes.service";
import { derechohabientesKey } from "./useDerechohabientes";

/**
 * Registra un derechohabiente, avisa y refresca la lista
 *
 * @remarks
 * Un hijo menor o estudiante activa la asignación familiar del empleado en el
 * backend: también se refresca la consulta del empleado para que la ficha
 * muestre el cambio.
 */
export function useRegistrarDerechohabiente(empleadoId: string) {
  return useMutationConAviso({
    mutationFn: (dto: Omit<RegistrarDerechohabienteDto, "empleado_id">) =>
      derechohabientesService.registrar(empleadoId, dto),
    successMessage: "El derechohabiente se registró correctamente.",
    invalidate: [derechohabientesKey.all, ROOT_KEYS.empleados],
  });
}

/** Reactiva a un derechohabiente quitado, avisa y refresca la lista y el empleado */
export function useReactivarDerechohabiente(id: string) {
  return useMutationConAviso({
    mutationFn: () => derechohabientesService.reactivar(id),
    successMessage: "El derechohabiente se reactivó correctamente.",
    invalidate: [derechohabientesKey.all, ROOT_KEYS.empleados],
  });
}

/**
 * Da de baja a un derechohabiente, avisa y refresca la lista
 *
 * @remarks
 * El aviso ofrece "Deshacer", que reactiva al mismo derechohabiente. Cuando se
 * pulsa, el modal y la tarjeta ya se desmontaron, así que no usa la mutación
 * del componente: llama al servicio y refresca con el `queryClient`.
 */
export function useDesactivarDerechohabiente(id: string) {
  const queryClient = useQueryClient();

  const deshacer = () => {
    const promesa = derechohabientesService
      .reactivar(id)
      .then(() =>
        Promise.all([
          queryClient.invalidateQueries({ queryKey: derechohabientesKey.all }),
          queryClient.invalidateQueries({ queryKey: ROOT_KEYS.empleados }),
        ]),
      );

    toast.promise(promesa, {
      loading: "Reactivando derechohabiente...",
      success: "El derechohabiente se reactivó correctamente.",
      error: getApiErrorMessage,
    });
  };

  return useMutationConAviso({
    mutationFn: () => derechohabientesService.desactivar(id),
    successMessage: "El derechohabiente se quitó correctamente.",
    successAction: () => ({ label: "Deshacer", onClick: deshacer }),
    invalidate: [derechohabientesKey.all],
  });
}

/** Adjunta un sustento a un derechohabiente, avisa y refresca sus documentos */
export function useSubirSustento() {
  return useMutationConAviso({
    mutationFn: ({
      dto,
      file,
    }: {
      dto: SubirSustentoDerechohabienteDto;
      file: File;
    }) => derechohabientesService.subirSustento(dto, file),
    successMessage: "El sustento se adjuntó correctamente.",
    invalidate: [derechohabientesKey.all],
  });
}
