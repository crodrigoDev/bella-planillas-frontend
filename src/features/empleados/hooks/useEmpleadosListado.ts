import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getEmpleadosMock } from "../data/empleados.mock";
import { getEmpleadosQuery } from "../utils/empleados.utils";
import type { EmpleadosQuery } from "../types/empleados.types";

/** Comparte los filtros, la consulta y la paginacion con la pantalla */
export function useEmpleadosListado() {
  const [params, setParams] = useSearchParams();
  const query = getEmpleadosQuery(params);
  const listado = useQuery({
    queryKey: ["empleados", "mock", query],
    // Este es el punto donde se reemplaza el mock por empleadosService.listar
    queryFn: () => getEmpleadosMock(query),
    retry: false,
  });

  const changeFilters = (values: EmpleadosQuery): void => {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
    });
    next.set("page", "1");
    void setParams(next, { replace: true });
  };

  const resetFilters = (): void => {
    void setParams(
      { page: "1", limit: String(query.limit) },
      { replace: true },
    );
  };

  const changePage = (page: number): void => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    void setParams(next);
  };

  return {
    data: listado.data,
    isPending: listado.isPending,
    isError: listado.isError,
    error: listado.error,
    refetch: listado.refetch,
    query,
    changeFilters,
    resetFilters,
    changePage,
  };
}
