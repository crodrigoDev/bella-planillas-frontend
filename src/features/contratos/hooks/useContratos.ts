import { useQuery } from "@tanstack/react-query";

import { contratosService } from "../services/contratos.service";

/** Claves de caché de contratos */
export const contratosKey = {
  all: ["contratos"] as const,
  byEmpleado: (empleadoId: string) =>
    ["contratos", "empleado", empleadoId] as const,
  detail: (id: string) => ["contratos", "detalle", id] as const,
};

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
