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

/**
 * Obtiene los regímenes de pensión, AFP y bancos del paso de datos financieros
 *
 * @returns Una consulta por cada catálogo
 */
export function useDatosFinancierosCatalogos() {
  const regimenes = useCatalogo(["regimenes-pension"], () =>
    catalogosService.listRegimenesPension(),
  );

  const afps = useCatalogo(["afps"], () => catalogosService.listAfps());

  const bancos = useCatalogo(["bancos"], () => catalogosService.listBancos());

  return { regimenes, afps, bancos };
}

/** Obtiene los tipos de documento (empleado y derechohabientes) */
export function useTiposDocumento() {
  return useCatalogo(["tipos-documento"], () =>
    catalogosService.listTiposDocumento(),
  );
}

/** Obtiene las modalidades de contrato del paso 3 del registro */
export function useModalidadesContrato() {
  return useCatalogo(["modalidades-contrato"], () =>
    catalogosService.listModalidadesContrato(),
  );
}
