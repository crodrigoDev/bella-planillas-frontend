import { useSearchParams } from "react-router-dom";
import type { EmpleadoFilters } from "../types/empleados.types";

const DEFAULT_LIMIT = 3;

/**
 * Convierte el texto de la URL en número de página válido
 */
const parsePage = (value: string | null) => {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

/**
 * Lee los filtros del listado de la URL y permite cambiarlos
 *
 * @returns Los filtros listos para consultar y las funciones para modificarlos
 *
 * @remarks
 * La URL es la fuente de la verdad, asi los filtros sobreviven al F5 y
 * se pueden compartir como enlace
 */
export function useEmpleadosFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: EmpleadoFilters = {
    page: parsePage(searchParams.get("page")),
    limit: DEFAULT_LIMIT,
  };

  const setPage = (page: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      // La primera página es la por defecto asi que no deberia ir en la URL
      if (page <= 1) next.delete("page");
      else next.set("page", String(page));

      return next;
    });
  };

  return {
    filters,
    setPage,
  };
}
