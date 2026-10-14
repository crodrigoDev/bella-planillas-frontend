import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EMPLEADOS_MOCK } from "../data/empleados.mock";
import { getEmpleadosQuery } from "../utils/empleados.utils";
import type { EmpleadosQuery } from "../types/empleados.types";

/** Comparte los filtros de la URL y los empleados mockeados con la pantalla */
export function useEmpleadosListado() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(() => [...EMPLEADOS_MOCK]);
  const query = getEmpleadosQuery(params);
  const search = query.search?.trim().toLocaleLowerCase("es-PE") ?? "";
  const empleados = data.filter(
    (empleado) =>
      (!query.area_id || empleado.area_id === query.area_id) &&
      (!query.cargo_id || empleado.cargo_id === query.cargo_id) &&
      (!query.jornada_id || empleado.jornada_id === query.jornada_id) &&
      (query.activo === undefined || empleado.activo === query.activo) &&
      [
        empleado.nombre,
        empleado.apellido,
        empleado.nro_documento,
        empleado.email,
      ]
        .join(" ")
        .toLocaleLowerCase("es-PE")
        .includes(search),
  );

  // Toma una nueva copia luego de una accion, sin cambiar los filtros
  const refresh = (): void => setData([...EMPLEADOS_MOCK]);

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
    refresh,
  };
}
