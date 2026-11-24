import { useQuery } from "@tanstack/react-query";

import { planillasService } from "../services/planillas.service";
import { planillasKey } from "./usePlanillas";

/**
 * Obtiene el detalle completo de una planilla por su identificador
 *
 * @param id - Identificador de la planilla; si falta, no se consulta
 * @returns Consulta de React Query con el detalle, o `null` si no existe
 */
export function usePlanilla(id: string | undefined) {
  return useQuery({
    queryKey: planillasKey.detail(id ?? ""),
    queryFn: () => planillasService.getById(id as string),
    enabled: Boolean(id),
  });
}
