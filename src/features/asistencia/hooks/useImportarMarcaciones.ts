import { useMutation } from "@tanstack/react-query";
import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { marcacionesService } from "../services/marcaciones.service";
import { asistenciaKey } from "./useAsistencia";
import { marcacionesKey } from "./useMarcaciones";

/** Revisa el Excel sin guardar nada; el error lo muestra quien la usa */
export function useValidarMarcaciones() {
  return useMutation({
    mutationFn: (file: File) => marcacionesService.validarExcel(file),
  });
}

/**
 * Importa el Excel, avisa con el resultado y refresca marcaciones y asistencia
 *
 * @remarks
 * El backend no recalcula el resumen mensual de los empleados: el aviso lo recuerda.
 */
export function useImportarMarcaciones() {
  return useMutationConAviso({
    mutationFn: (file: File) => marcacionesService.importarExcel(file),
    successMessage: ({ insertadas, duplicadas_omitidas }) =>
      `Se importaron ${insertadas} marcaciones (${duplicadas_omitidas} duplicadas omitidas). Regenera el resumen mensual de los empleados para ver los cambios.`,
    invalidate: [marcacionesKey.all, asistenciaKey.all],
  });
}
