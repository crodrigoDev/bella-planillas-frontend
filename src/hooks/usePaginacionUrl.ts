import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE_OPTIONS } from "@/components/data-table/dataTable.config";
import {
  applyParamChanges,
  parseLimit,
  parsePage,
  type ParamChanges,
} from "@/lib/urlParams.utils";

const DEFAULT_LIMIT = PAGE_SIZE_OPTIONS[0];

/**
 * Lee la página y las filas por página de la URL y permite cambiarlas
 *
 * @returns Los parámetros de la URL, `page`, `limit` y las funciones para modificarlos
 *
 * @remarks
 * Es la base de los hooks de filtros de los listados: cada uno agrega sus propios
 * filtros y usa `updateParams` para cambiarlos. Los valores por defecto (página 1 y
 * la primera cantidad de filas) no se escriben en la URL.
 */
export function usePaginacionUrl() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(
    searchParams.get("limit"),
    PAGE_SIZE_OPTIONS,
    DEFAULT_LIMIT,
  );

  /**
   * Aplica cambios a los parámetros de la URL
   *
   * @param replace - Reemplaza la entrada del historial en lugar de agregar otra
   */
  const updateParams = (changes: ParamChanges, replace = false) => {
    setSearchParams((current) => applyParamChanges(current, changes), {
      replace,
    });
  };

  /**
   * Cambia de página
   *
   * @param replace - Reemplaza la entrada del historial en lugar de agregar otra
   */
  const setPage = (nextPage: number, replace = false) => {
    updateParams(
      { page: nextPage <= 1 ? undefined : String(nextPage) },
      replace,
    );
  };

  /** Cambia la cantidad de filas por página y vuelve a la primera */
  const setLimit = (nextLimit: number) => {
    updateParams({
      limit: nextLimit === DEFAULT_LIMIT ? undefined : String(nextLimit),
      page: undefined,
    });
  };

  return { searchParams, page, limit, updateParams, setPage, setLimit };
}
