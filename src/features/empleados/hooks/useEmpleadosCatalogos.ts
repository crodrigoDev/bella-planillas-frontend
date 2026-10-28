import { useQuery } from "@tanstack/react-query";
import { empleadosCatalogosService } from "../services/empleadosCatalogos.service";

// Tiempo de caducación de la cache para los catálogos
const CATALOGO_STALE_TIME = 5 * 60_000;

/**
 * Obtiene las opciones de los filtros del listado de empleados
 *
 * @param areaId - Si se indica, los cargos se limitan a esa área
 * @returns Una consulta por cada catálogo
 */
export function useEmpleadosCatalogos(areaId?: string) {
  const areas = useQuery({
    queryKey: ["catalogos", "areas"],
    queryFn: () => empleadosCatalogosService.listAreas(),
    staleTime: CATALOGO_STALE_TIME,
  });

  const cargos = useQuery({
    queryKey: ["catalogos", "cargos", areaId ?? null],
    queryFn: () => empleadosCatalogosService.listCargos(areaId),
    staleTime: CATALOGO_STALE_TIME,
  });

  const jornadas = useQuery({
    queryKey: ["catalogos", "jornadas"],
    queryFn: () => empleadosCatalogosService.listJornadas(),
    staleTime: CATALOGO_STALE_TIME,
  });

  return {
    areas,
    cargos,
    jornadas,
  };
}
