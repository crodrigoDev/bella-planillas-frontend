import { useCatalogo } from "@/hooks/useCatalogo";
import { empleadosCatalogosService } from "../services/empleadosCatalogos.service";

// Áreas, cargos y jornadas se editan con más frecuencia: caducan antes
const STALE_TIME = 5 * 60_000;

/**
 * Obtiene las opciones del formulario y de los filtros de empleados
 *
 * @param areaId - Si se indica, los cargos se limitan a esa área
 * @returns Una consulta por cada catálogo
 */
export function useEmpleadosCatalogos(areaId?: string) {
  const areas = useCatalogo(
    ["areas"],
    () => empleadosCatalogosService.listAreas(),
    STALE_TIME,
  );

  const cargos = useCatalogo(
    ["cargos", areaId ?? null],
    () => empleadosCatalogosService.listCargos(areaId),
    STALE_TIME,
  );

  const jornadas = useCatalogo(
    ["jornadas"],
    () => empleadosCatalogosService.listJornadas(),
    STALE_TIME,
  );

  return { areas, cargos, jornadas };
}
