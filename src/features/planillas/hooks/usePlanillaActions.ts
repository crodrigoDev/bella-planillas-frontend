import type { CongelarPlanillaDto } from "@jyp/shared-contracts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { getApiErrorMessage } from "@/lib/api/apiError.utils";
import { descargarArchivo } from "@/lib/archivo.utils";
import { planillasService } from "../services/planillas.service";
import { planillasKey } from "./usePlanillas";

/**
 * Valida una planilla abierta, muestra un aviso y refresca listado y detalle
 */
export function useValidarPlanilla(id: string) {
  return useMutationConAviso({
    mutationFn: (dto: CongelarPlanillaDto) => planillasService.validar(id, dto),
    successMessage: "La planilla se validó correctamente.",
    invalidate: [planillasKey.lists(), planillasKey.detail(id)],
  });
}

/**
 * Descarga la boleta de pago en PDF de una planilla y avisa si ocurre un error
 */
export function useDescargarBoleta() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { blob, nombre } = await planillasService.descargarBoleta(id);
      descargarArchivo(blob, nombre);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
