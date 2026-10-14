import type { ReactNode } from "react";
import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dataTableFeatures, type DataTableFeatures } from "./data-table.config";
import DataTablePagination from "./DataTablePagination";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  caption?: string;
  emptyState?: ReactNode;
  className?: string;
}

/** Renderiza columnas y filas con shadcn, y delega la paginacion a TanStack */
export default function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  caption = "Listado de registros",
  emptyState = "No se encontraron registros",
  className,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
  });
  const rows = table.getRowModel().rows;

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border bg-background">
        {rows.length ? (
          <Table className={cn("text-xs", className)}>
            <TableCaption className="sr-only">{caption}</TableCaption>
            <TableHeader className="bg-slate-50/80 dark:bg-muted">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id} className="hover:bg-transparent">
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      scope="col"
                      colSpan={header.colSpan}
                      className="h-10 px-3 text-[11px] font-medium text-muted-foreground first:pl-4 last:pr-4"
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-2.5 first:pl-4 last:pr-4"
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            {emptyState}
          </div>
        )}
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
