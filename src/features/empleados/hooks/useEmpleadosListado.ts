import { useSearchParams } from "react-router-dom";
import { getEmpleadosMock } from "../data/empleados.mock";
import { getEmpleadosQuery } from "../utils/empleados.utils";
import type { EmpleadosQuery } from "../types/empleados.types";

/** Comparte los filtros de la URL y los empleados mockeados con la pantalla */
export function useEmpleadosListado() {
  const [params, setParams] = useSearchParams();
  const query = getEmpleadosQuery(params);
  const empleados = getEmpleadosMock(query);

  const changeFilters = (values: EmpleadosQuery): void => {
    const next = new URLSearchParams(params);
    next.delete("page");
    next.delete("limit");
    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
    });
    void setParams(next, { replace: true });
  };

  const resetFilters = (): void => {
    void setParams({}, { replace: true });
  };

  return {
    empleados,
    query,
    changeFilters,
    resetFilters,
  };
}
