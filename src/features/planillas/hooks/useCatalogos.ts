import { useCatalogo } from "@/hooks/useCatalogo";
import { planillasCatalogosService } from "../services/catalogos.service";

const EMPLEADOS_STALE_TIME = 5 * 60_000;

/**
 * Obtiene los colaboradores activos para elegir uno al generar planillas
 */
export function useEmpleadosActivosPlanillas(search?: string) {
  return useCatalogo(
    ["planillas", "empleados-activos", search ?? ""],
    () => planillasCatalogosService.listEmpleadosActivos(search),
    { staleTime: EMPLEADOS_STALE_TIME, keepPrevious: true },
  );
}

/**
 * Obtiene hasta 100 colaboradores (activos e inactivos) para resolver nombres en observaciones
 */
export function useEmpleadosCatalogoPlanillas() {
  return useCatalogo(
    ["planillas", "empleados"],
    () => planillasCatalogosService.listEmpleados(),
    { staleTime: EMPLEADOS_STALE_TIME },
  );
}
