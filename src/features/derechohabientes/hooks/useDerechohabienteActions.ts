import type {
  RegistrarDerechohabienteDto,
  SubirSustentoDerechohabienteDto,
} from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
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

/** Da de baja a un derechohabiente, avisa y refresca la lista */
export function useDesactivarDerechohabiente(id: string) {
  return useMutationConAviso({
    mutationFn: () => derechohabientesService.desactivar(id),
    successMessage: "El derechohabiente se quitó correctamente.",
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
