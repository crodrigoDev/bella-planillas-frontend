import { useState } from "react";
import {
  useTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowData,
} from "@tanstack/react-table";
import { cn } from "cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dataTableFeatures,
  PAGE_SIZE_OPTIONS,
  type DataTableFeatures,
} from "@/components/data-table/dataTable.config";
import { getPageItems } from "@/lib/pagination.utils";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  data: TData[];
  pagination: PaginationState;
  rowCount: number;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading?: boolean; // Primera carga: muestra filas de carga en lugar de datos
  isFetching?: boolean; // Cargando otra página: atenua la tabla pero conserva los datos
  emptyMessage: string;
  itemLabel?: string; // Nombre de las filas en plural: "colaboradores", "áreas"...
  pageSizeOptions?: readonly number[]; // Cantidades de filas por página que se pueden elegir
}

const SKELETON_ROWS = 6;

// Colores de los botones de página: la actual rellena, las demás con borde
const PAGE_CLASS =
  "border border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50";
const PAGE_ACTIVE_CLASS =
  "border-transparent bg-primary text-primary-foreground hover:bg-primary/80";

/**
 * Tabla genérica con paginación controlada por el servidor
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  pagination,
  rowCount,
  onPaginationChange,
  isLoading = false,
  isFetching = false,
  emptyMessage = "No se encontraron resultados.",
  itemLabel = "registros",
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: DataTableProps<TData>) {
  // Con scroll, la cabecera proyecta una sombra hacia las filas
  const [scrolled, setScrolled] = useState(false);

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    rowCount,
    manualPagination: true,
    state: { pagination },
    onPaginationChange,
  });

  const { pageIndex, pageSize } = pagination;
  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;
  const firstRow = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <div
        onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}
        className={cn(
          "min-h-0 overflow-auto rounded-lg border bg-card",
          "[&_[data-slot=table-container]]:overflow-visible [&_table]:min-w-max",
          "[&_th:not(:last-child)]:border-r [&_td:not(:last-child)]:border-r",
          "[&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-[color-mix(in_oklab,var(--muted)_40%,var(--card))] [&_th]:shadow-[inset_0_-1px_0_var(--border)] [&_th]:transition-shadow",
          scrolled &&
            "[&_th]:shadow-[inset_0_-1px_0_var(--border),0_4px_6px_-2px_rgb(0_0_0/0.15)]",
        )}
      >
        <Table
          className={cn(
            isFetching && !isLoading && "opacity-60 transition-opacity",
          )}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <TableRow key={index}>
                  {columns.map((_, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-muted-foreground">
          {rowCount > 0
            ? `Mostrando ${firstRow}-${lastRow} de ${rowCount} ${itemLabel}`
            : "Sin registros"}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Registros por página:
            </span>
            <Select
              items={pageSizeOptions.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
              value={String(pageSize)}
              onValueChange={(next) => {
                if (next !== null) table.setPageSize(Number(next));
              }}
            >
              <SelectTrigger size="sm" aria-label="Registros por página">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Pagination aria-label="Paginación" className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  size="sm"
                  text="Anterior"
                  aria-label="Página anterior"
                  aria-disabled={!table.getCanPreviousPage()}
                  className={cn(
                    PAGE_CLASS,
                    !table.getCanPreviousPage() &&
                      "pointer-events-none opacity-50",
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    if (table.getCanPreviousPage()) table.previousPage();
                  }}
                />
              </PaginationItem>

              {getPageItems(pageIndex + 1, pageCount).map((item, index) => (
                <PaginationItem
                  key={item === "ellipsis" ? `ellipsis-${index}` : item}
                >
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      size="sm"
                      className={
                        item === pageIndex + 1 ? PAGE_ACTIVE_CLASS : PAGE_CLASS
                      }
                      aria-label={`Página ${item}`}
                      isActive={item === pageIndex + 1}
                      onClick={(event) => {
                        event.preventDefault();
                        table.setPageIndex(item - 1);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  size="sm"
                  text="Siguiente"
                  aria-label="Página siguiente"
                  aria-disabled={!table.getCanNextPage()}
                  className={cn(
                    PAGE_CLASS,
                    !table.getCanNextPage() && "pointer-events-none opacity-50",
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    if (table.getCanNextPage()) table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
