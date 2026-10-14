import { useId } from "react";
import type { ReactTable, RowData } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DataTableFeatures } from "./data-table.config";

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

const PAGE_SIZES = [10, 20, 50, 100];
const PAGE_SIZE_OPTIONS = PAGE_SIZES.map((size) => ({
  value: String(size),
  label: String(size),
}));

/** Muestra el rango de registros y permite cambiar de pagina o su tamaño */
export default function DataTablePagination<TData extends RowData>({
  table,
}: DataTablePaginationProps<TData>) {
  const selectId = useId();
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.getRowCount();
  const rowCount = table.getRowModel().rows.length;
  const firstRecord = rowCount ? pageIndex * pageSize + 1 : 0;
  const lastRecord = rowCount ? firstRecord + rowCount - 1 : 0;
  const pageCount = table.getPageCount();

  // Mantiene hasta cinco numeros cercanos a la pagina actual
  const firstPage = Math.max(0, Math.min(pageIndex - 2, pageCount - 5));
  const pages = Array.from(
    { length: Math.min(5, pageCount) },
    (_, index) => firstPage + index,
  );
  const lastPage = firstPage + pages.length - 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-muted-foreground">
      <p role="status">
        Mostrando {firstRecord}–{lastRecord} de {total}{" "}
        {total === 1 ? "registro" : "registros"}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor={selectId}>Registros por página</label>
          <Select
            items={PAGE_SIZE_OPTIONS}
            value={String(pageSize)}
            onValueChange={(value) => {
              if (!value) return;
              table.setPageSize(Number(value));
              // Vuelve al inicio para mostrar el nuevo tamaño desde el primer registro
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger
              id={selectId}
              size="sm"
              className="min-w-16 bg-background text-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <nav
          aria-label="Paginación de la tabla"
          className="flex flex-wrap items-center gap-1"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          {firstPage > 0 && (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Ir a la página 1"
              onClick={() => table.setPageIndex(0)}
            >
              1
            </Button>
          )}
          {firstPage > 1 && (
            <span aria-hidden="true" className="px-1">…</span>
          )}
          {pages.map((page) => (
            <Button
              key={page}
              type="button"
              variant={page === pageIndex ? "default" : "outline"}
              size="icon-sm"
              aria-label={`Ir a la página ${page + 1}`}
              aria-current={page === pageIndex ? "page" : undefined}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </Button>
          ))}
          {lastPage < pageCount - 2 && (
            <span aria-hidden="true" className="px-1">…</span>
          )}
          {lastPage < pageCount - 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={`Ir a la página ${pageCount}`}
              onClick={() => table.setPageIndex(pageCount - 1)}
            >
              {pageCount}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </nav>
      </div>
    </div>
  );
}
