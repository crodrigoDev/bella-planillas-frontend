import type {
  EditarContratoDto,
  RenovarContratoDto,
} from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { contratosService, type NuevoContrato } from "../services/contratos.service";
import { contratosKey } from "./useContratos";

/** Crea un contrato de un empleado, avisa y refresca los contratos */
export function useCrearContrato(empleadoId: string) {
  return useMutationConAviso({
    mutationFn: (dto: NuevoContrato) => contratosService.crear(empleadoId, dto),
    successMessage: "El contrato se registró correctamente.",
    invalidate: [contratosKey.all],
  });
}

/** Edita un contrato, avisa y refresca los contratos */
export function useEditarContrato(id: string) {
  return useMutationConAviso({
    mutationFn: (dto: EditarContratoDto) => contratosService.editar(id, dto),
    successMessage: "El contrato se actualizó correctamente.",
    invalidate: [contratosKey.all],
  });
}

/** Renueva un contrato, avisa y refresca los contratos */
export function useRenovarContrato(id: string) {
  return useMutationConAviso({
    mutationFn: (dto: RenovarContratoDto) => contratosService.renovar(id, dto),
    successMessage: "El contrato se renovó correctamente.",
    invalidate: [contratosKey.all],
  });
}

/** Anula un contrato, avisa y refresca los contratos */
export function useAnularContrato(id: string) {
  return useMutationConAviso({
    mutationFn: () => contratosService.anular(id),
    successMessage: "El contrato se anuló correctamente.",
    invalidate: [contratosKey.all],
  });
}

/** Adjunta el PDF firmado de un contrato, avisa y refresca los contratos */
export function useSubirContratoPdf(id: string) {
  return useMutationConAviso({
    mutationFn: (file: File) => contratosService.subirPdf(id, file),
    successMessage: "El PDF se adjuntó correctamente.",
    invalidate: [contratosKey.all],
  });
}
