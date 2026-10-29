import { useQuery } from "@tanstack/react-query";

import { empleadoDetalleService } from "../services/empleadoDetalle.service";
import { empleadosKey } from "./useEmpleados";

/** Contratos de un empleado, para la pestaña Contratos de la ficha */
export function useEmpleadoContratos(empleadoId: string) {
  return useQuery({
    queryKey: [...empleadosKey.detail(empleadoId), "contratos"],
    queryFn: () => empleadoDetalleService.listContratos(empleadoId),
  });
}

/** Derechohabientes de un empleado, para la pestaña Derechohabientes */
export function useEmpleadoDerechohabientes(empleadoId: string) {
  return useQuery({
    queryKey: [...empleadosKey.detail(empleadoId), "derechohabientes"],
    queryFn: () => empleadoDetalleService.listDerechohabientes(empleadoId),
  });
}

/** Datos financieros de un empleado; `data` es null si aún no tiene */
export function useEmpleadoDatosFinancieros(empleadoId: string) {
  return useQuery({
    queryKey: [...empleadosKey.detail(empleadoId), "datos-financieros"],
    queryFn: () => empleadoDetalleService.getDatosFinancieros(empleadoId),
  });
}
