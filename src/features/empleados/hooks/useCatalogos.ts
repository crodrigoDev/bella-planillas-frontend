import { useCatalogo } from "@/hooks/useCatalogo";
import { catalogosService } from "../services/catalogos.service";

// Áreas, cargos y jornadas se editan con más frecuencia: caducan antes
const ORGANIZACION_STALE_TIME = 5 * 60_000;

/**
 * Obtiene las áreas, cargos y jornadas del listado y del registro de empleados
 *
 * @param areaId - Si se indica, los cargos se limitan a esa área
 * @returns Una consulta por cada catálogo
 */
export function useEmpleadosCatalogos(areaId?: string) {
  const areas = useCatalogo(
    ["areas"],
    () => catalogosService.listAreas(),
    ORGANIZACION_STALE_TIME,
  );

  const cargos = useCatalogo(
    ["cargos", areaId ?? null],
    () => catalogosService.listCargos(areaId),
    ORGANIZACION_STALE_TIME,
  );

  const jornadas = useCatalogo(
    ["jornadas"],
    () => catalogosService.listJornadas(),
    ORGANIZACION_STALE_TIME,
  );

  return { areas, cargos, jornadas };
}

/** Obtiene los tipos de documento (empleado y derechohabientes) */
export function useTiposDocumento() {
  return useCatalogo(["tipos-documento"], () =>
    catalogosService.listTiposDocumento(),
  );
}

/**
 * Obtiene los empleados activos para un selector (filtro y registro de marcaciones)
 *
 * @param search - Nombre o documento a buscar; sin texto trae los primeros 100
 */
export function useEmpleadosActivos(search?: string) {
  return useCatalogo(
    ["empleados-activos", search ?? ""],
    () => catalogosService.listEmpleados(search),
    ORGANIZACION_STALE_TIME,
    true,
  );
}
