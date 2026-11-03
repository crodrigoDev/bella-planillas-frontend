import { useQuery } from "@tanstack/react-query";

import { derechohabientesService } from "../services/derechohabientes.service";

/** Claves de caché de derechohabientes */
export const derechohabientesKey = {
  all: ["derechohabientes"] as const,
  byEmpleado: (empleadoId: string) =>
    ["derechohabientes", "empleado", empleadoId] as const,
  detail: (id: string) => ["derechohabientes", "detalle", id] as const,
};

/** Derechohabientes de un empleado, para la pestaña de la ficha */
export function useDerechohabientesEmpleado(empleadoId: string) {
  return useQuery({
    queryKey: derechohabientesKey.byEmpleado(empleadoId),
    queryFn: () => derechohabientesService.listByEmpleado(empleadoId),
  });
}

/**
 * Un derechohabiente con sus documentos de sustento
 *
 * @remarks
 * El listado no trae los documentos; se piden al abrir el modal de sustentos.
 */
export function useDerechohabienteSustentos(id: string) {
  return useQuery({
    queryKey: derechohabientesKey.detail(id),
    queryFn: () => derechohabientesService.getById(id),
  });
}
