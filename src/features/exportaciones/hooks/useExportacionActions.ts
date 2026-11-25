import type { SolicitarExportacionDto } from "@jyp/shared-contracts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api/apiError.utils";
import { descargarArchivo } from "@/lib/archivo.utils";
import { exportacionesService } from "../services/exportaciones.service";

/**
 * Solicita la generación de una exportación mensual
 */
export function useSolicitarExportacion() {
  return useMutation({
    mutationFn: (dto: SolicitarExportacionDto) =>
      exportacionesService.solicitar(dto),
  });
}

/**
 * Descarga un archivo generado de la exportación y avisa si ocurre un error
 */
export function useDescargarArchivoExportacion() {
  return useMutation({
    mutationFn: async ({ id, nombre }: { id: string; nombre: string }) => {
      const archivo = await exportacionesService.descargarArchivo(id, nombre);
      descargarArchivo(archivo.blob, archivo.nombre);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
