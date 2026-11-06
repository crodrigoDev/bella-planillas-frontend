import { useEffect } from "react";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";

interface UsePaginacionServidorOptions {
  page: number;
  limit: number;
  /** Total de páginas que informa el servidor; `undefined` mientras no hay datos definitivos */
  totalPages: number | undefined;
  setPage: (page: number, replace?: boolean) => void;
  setLimit: (limit: number) => void;
}

/**
 * Prepara la paginación del servidor para `DataTable`
 *
 * @returns `pagination` y `onPaginationChange`, las props de `DataTable`
 *
 * @remarks
 * Cambiar las filas por página vuelve a la primera. Si la página de la URL supera
 * la última (por ejemplo tras borrar filas), salta a la última sin sumar al historial.
 * Pasa `totalPages` en `undefined` mientras la consulta carga o muestra datos anteriores.
 */
export function usePaginacionServidor({
  page,
  limit,
  totalPages,
  setPage,
  setLimit,
}: UsePaginacionServidorOptions) {
  useEffect(() => {
    if (totalPages === undefined) return;

    const lastPage = Math.max(totalPages, 1);

    if (page > lastPage) setPage(lastPage, true);
  }, [totalPages, page, setPage]);

  const pagination: PaginationState = { pageIndex: page - 1, pageSize: limit };

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;

    if (next.pageSize !== pagination.pageSize) setLimit(next.pageSize);
    else setPage(next.pageIndex + 1);
  };

  return { pagination, onPaginationChange };
}
