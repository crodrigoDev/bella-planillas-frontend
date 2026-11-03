import { useQuery } from "@tanstack/react-query";

import { asistenciaService } from "../services/asistencia.service";

/** Claves de caché de asistencia */
export const asistenciaKey = {
  all: ["asistencia"] as const,
  resumen: (empleadoId: string, periodo: string) =>
    ["asistencia", "resumen", empleadoId, periodo] as const,
};

/** Resumen de un mes de un empleado; `data` es null si todavía no se generó */
export function useResumenMes(empleadoId: string, periodo: string) {
  return useQuery({
    queryKey: asistenciaKey.resumen(empleadoId, periodo),
    queryFn: () => asistenciaService.getResumen(empleadoId, periodo),
  });
}
