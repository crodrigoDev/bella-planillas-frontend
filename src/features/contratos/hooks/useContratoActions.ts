import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  EditarContratoDto,
  RenovarContratoDto,
} from "@jyp/shared-contracts";

import { contratosService } from "../services/contratos.service";
import { contratosKey } from "./useContratos";

/** Edita un contrato, avisa y refresca los contratos */
export function useEditarContrato(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: EditarContratoDto) => contratosService.editar(id, dto),
    onSuccess: () => {
      toast.success("El contrato se actualizó correctamente.");

      return queryClient.invalidateQueries({ queryKey: contratosKey.all });
    },
  });
}

/** Renueva un contrato, avisa y refresca los contratos */
export function useRenovarContrato(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RenovarContratoDto) => contratosService.renovar(id, dto),
    onSuccess: () => {
      toast.success("El contrato se renovó correctamente.");

      return queryClient.invalidateQueries({ queryKey: contratosKey.all });
    },
  });
}

/** Anula un contrato, avisa y refresca los contratos */
export function useAnularContrato(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => contratosService.anular(id),
    onSuccess: () => {
      toast.success("El contrato se anuló correctamente.");

      return queryClient.invalidateQueries({ queryKey: contratosKey.all });
    },
  });
}

/** Adjunta el PDF firmado de un contrato, avisa y refresca los contratos */
export function useSubirContratoPdf(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => contratosService.subirPdf(id, file),
    onSuccess: () => {
      toast.success("El PDF se adjuntó correctamente.");

      return queryClient.invalidateQueries({ queryKey: contratosKey.all });
    },
  });
}
