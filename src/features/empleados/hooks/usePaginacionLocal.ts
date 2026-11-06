import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";

const TAMANO_PAGINA = 20;

/**
 * Pagina en el navegador una lista que ya está completa en memoria
 *
 * @param items - Todas las filas
 * @returns Lo que necesita `DataTable`: la página actual, su estado y el total
 */
export function usePaginacionLocal<T>(items: readonly T[]) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TAMANO_PAGINA,
  });

  const inicio = pagination.pageIndex * pagination.pageSize;

  return {
    pagination,
    onPaginationChange: setPagination,
    pageItems: items.slice(inicio, inicio + pagination.pageSize),
    rowCount: items.length,
  };
}
