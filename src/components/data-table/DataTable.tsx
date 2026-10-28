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
import { Button } from "@/components/ui/button";
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
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border bg-card">
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

          <nav
            aria-label="Paginación"
            className="flex flex-wrap items-center gap-1"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>

            {getPageItems(pageIndex + 1, pageCount).map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === pageIndex + 1 ? "default" : "outline"}
                  size="sm"
                  aria-label={`Página ${item}`}
                  aria-current={item === pageIndex + 1 ? "page" : undefined}
                  onClick={() => table.setPageIndex(item - 1)}
                >
                  {item}
                </Button>
              ),
            )}

            <Button
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
    </div>
  );
}
