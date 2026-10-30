import { useQuery } from "@tanstack/react-query";

import { datosFinancierosService } from "../services/datosFinancieros.service";

/** Claves de caché de datos financieros */
export const datosFinancierosKey = {
  all: ["datos-financieros"] as const,
  byEmpleado: (empleadoId: string) =>
    ["datos-financieros", "empleado", empleadoId] as const,
};

/** Datos financieros de un empleado; `data` es null si aún no tiene */
export function useDatosFinancierosEmpleado(empleadoId: string) {
  return useQuery({
    queryKey: datosFinancierosKey.byEmpleado(empleadoId),
    queryFn: () => datosFinancierosService.getByEmpleado(empleadoId),
  });
}
