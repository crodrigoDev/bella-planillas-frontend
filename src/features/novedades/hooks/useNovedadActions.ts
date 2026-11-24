import type {
  CrearNovedadPlanillaDto,
  ResolverNovedadPlanillaDto,
} from "@jyp/shared-contracts";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { novedadesService } from "../services/novedades.service";
import type { AccionNovedad } from "../types/novedades.types";
import { novedadesKey } from "./useNovedades";

const MENSAJES_RESOLUCION: Record<AccionNovedad, string> = {
  APROBADO: "La novedad se aprobó.",
  RECHAZADO: "La novedad se rechazó.",
  ANULADO: "La novedad se anuló.",
};

/** Variables para resolver una novedad */
export interface ResolverNovedadVars {
  id: string;
  dto: ResolverNovedadPlanillaDto;
}

/**
 * Registra una nueva novedad de planilla, avisa y refresca la lista
 */
export function useRegistrarNovedad() {
  return useMutationConAviso({
    mutationFn: (dto: CrearNovedadPlanillaDto) =>
      novedadesService.registrar(dto),
    successMessage: "La novedad se registró.",
    invalidate: [novedadesKey.all],
  });
}

/**
 * Resuelve una novedad (aprobar, rechazar o anular), avisa y refresca la lista
 *
 * @remarks
 * Ante un conflicto (409), refresca igualmente las novedades del mes para que
 * la fila muestre el estado y los datos actuales sin esperar a cerrar la ventana.
 */
export function useResolverNovedad() {
  const queryClient = useQueryClient();

  return useMutationConAviso({
    mutationFn: async ({ id, dto }: ResolverNovedadVars) => {
      try {
        return await novedadesService.resolver(id, dto);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 409) {
          void queryClient.invalidateQueries({ queryKey: novedadesKey.all });
        }
        throw error;
      }
    },
    successMessage: (_, { dto }) => MENSAJES_RESOLUCION[dto.estado],
    invalidate: [novedadesKey.all],
  });
}
