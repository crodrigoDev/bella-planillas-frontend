import { usePaginacionUrl } from "@/hooks/usePaginacionUrl";
import { getPeriodoActual, parsePeriodo } from "@/lib/periodo.utils";
import type { PlanillasFilters } from "../types/planillas.types";

/**
 * Lee los filtros del listado mensual de planillas desde la URL y permite modificarlos
 *
 * @remarks
 * El mes es obligatorio: si falta o es inválido en la URL se usa el mes actual
 * sin escribirlo en la URL. También conserva el identificador y el mes de una
 * generación en curso para que el avance sobreviva a una recarga o a un cambio de mes.
 */
export function usePlanillasFilters() {
  const { searchParams, page, limit, updateParams, setPage, setLimit } =
    usePaginacionUrl();

  const filters: PlanillasFilters = {
    periodo: parsePeriodo(searchParams.get("periodo")) ?? getPeriodoActual(),
    page,
    limit,
  };

  const trabajo = searchParams.get("trabajo")?.trim() || null;
  const trabajoPeriodo =
    parsePeriodo(searchParams.get("trabajo_periodo")) ?? filters.periodo;

  const setPeriodo = (periodo: string) => {
    updateParams({
      periodo: periodo === getPeriodoActual() ? undefined : periodo,
      page: undefined,
    });
  };

  const setTrabajo = (id: string | null, periodo?: string) => {
    const changes: Record<string, string | undefined> = {
      trabajo: id || undefined,
      trabajo_periodo: id ? (periodo ?? filters.periodo) : undefined,
    };

    if (periodo !== undefined) {
      changes.periodo = periodo === getPeriodoActual() ? undefined : periodo;
      changes.page = undefined;
    }

    updateParams(changes);
  };

  return {
    filters,
    trabajo,
    trabajoPeriodo,
    setPeriodo,
    setPage,
    setLimit,
    setTrabajo,
  };
}
