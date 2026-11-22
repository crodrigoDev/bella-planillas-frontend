import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";

/**
 * Claves de caché del dashboard de Recursos Humanos
 */
export const dashboardKey = {
  all: ["dashboard"] as const,
  rrhh: (periodo: string) => ["dashboard", "rrhh", periodo] as const,
};

/**
 * Obtiene el resumen del dashboard de Recursos Humanos para el periodo indicado
 *
 * @param periodo - Mes en formato YYYY-MM
 *
 * @remarks
 * Mantiene los datos del mes anterior visibles mientras carga el nuevo mes.
 */
export function useDashboardRrhh(periodo: string) {
  return useQuery({
    queryKey: dashboardKey.rrhh(periodo),
    queryFn: () => dashboardService.getRrhh(periodo),
    placeholderData: keepPreviousData,
  });
}
