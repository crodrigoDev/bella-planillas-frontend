import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { contratosService } from "../services/contratos.service";
import type { ContratoFilters } from "../types/contratos.types";

/**
 * Claves de caché de contratos
 *
 * @remarks
 * Invalidar `all` refresca también el listado global, sin importar sus filtros.
 */
export const contratosKey = {
  all: ROOT_KEYS.contratos,
  list: (filters: ContratoFilters) => ["contratos", "list", filters] as const,
  byEmpleado: (empleadoId: string) =>
    ["contratos", "empleado", empleadoId] as const,
  detail: (id: string) => ["contratos", "detalle", id] as const,
};

/**
 * Una página de contratos de todos los colaboradores según los filtros
 *
 * @param filters - Página y filtros del listado
 *
 * @remarks
 * Mantiene la página anterior visible mientras llega la nueva.
 */
export function useContratos(filters: ContratoFilters) {
  return useQuery({
    queryKey: contratosKey.list(filters),
    queryFn: () => contratosService.list(filters),
    placeholderData: keepPreviousData,
  });
}

/** Contratos de un empleado, para la pestaña Contratos de la ficha */
export function useContratosEmpleado(empleadoId: string) {
  return useQuery({
    queryKey: contratosKey.byEmpleado(empleadoId),
    queryFn: () => contratosService.listByEmpleado(empleadoId),
  });
}

/**
 * Detalle de un contrato
 *
 * @remarks
 * El listado no trae la observación; el formulario de edición la necesita.
 */
export function useContratoDetalle(id: string) {
  return useQuery({
    queryKey: contratosKey.detail(id),
    queryFn: () => contratosService.getById(id),
  });
}

/**
 * PDF de un contrato como URL temporal, para mostrarlo en un visor
 *
 * @remarks
 * No se guarda en caché (`gcTime: 0`): la URL se libera al cerrar el visor.
 */
export function useContratoPdf(id: string) {
  return useQuery({
    queryKey: [...contratosKey.detail(id), "pdf"],
    queryFn: async () =>
      URL.createObjectURL(await contratosService.descargarPdf(id)),
    gcTime: 0,
    staleTime: 0,
  });
}
