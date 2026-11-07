import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { auditoriaService } from "../services/auditoria.service";
import type { AuditoriaFilters } from "../types/auditoria.types";

/** Claves de caché de auditoría */
export const auditoriaKey = {
  all: ["auditoria"] as const,
  list: (filters: AuditoriaFilters) => ["auditoria", "list", filters] as const,
  detail: (id: string) => ["auditoria", "detail", id] as const,
};

/**
 * Obtiene una página de la bitácora según los filtros
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva.
 */
export function useAuditoria(filters: AuditoriaFilters) {
  return useQuery({
    queryKey: auditoriaKey.list(filters),
    queryFn: () => auditoriaService.list(filters),
    placeholderData: keepPreviousData,
  });
}

/**
 * Obtiene una fila de la bitácora con sus valores antes y después
 *
 * @param id - Id de la fila; sin id no se consulta
 * @returns La consulta; `data` es null si la fila no existe
 */
export function useAuditoriaRegistro(id: string | undefined) {
  return useQuery({
    queryKey: auditoriaKey.detail(id ?? ""),
    queryFn: () => auditoriaService.getById(id as string),
    enabled: Boolean(id),
  });
}
