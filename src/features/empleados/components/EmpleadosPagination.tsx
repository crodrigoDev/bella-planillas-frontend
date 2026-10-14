import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMPLEADOS_PAGE_SIZES } from "../config/empleados.config";

interface EmpleadosPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

/** Cambia la pagina y la cantidad de filas sin perder los filtros */
export default function EmpleadosPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: EmpleadosPaginationProps) {
  const start = total ? (page - 1) * limit + 1 : 0;
  const end = Math.min(page * limit, total);
  // La URL tambien puede recibir otros limites validos entre 1 y 100
  const sizes = [...new Set([...EMPLEADOS_PAGE_SIZES, limit])].sort(
    (a, b) => a - b,
  );
  const options = sizes.map((value) => ({
    value: String(value),
    label: String(value),
  }));

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-1 py-4 text-xs text-slate-500">
      <p role="status">
        Mostrando{" "}
        <span className="font-medium text-slate-700 dark:text-foreground">
          {start}–{end}
        </span>
        {" de "}
        <span className="font-medium text-slate-700 dark:text-foreground">
          {total}
        </span>{" "}
        {total === 1 ? "empleado" : "empleados"}
      </p>
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2">
          <label htmlFor="empleados-limit">Filas por página</label>
          <Select
            items={options}
            value={String(limit)}
            onValueChange={(value) => {
              if (value) onLimitChange(Number(value));
            }}
          >
            <SelectTrigger
              id="empleados-limit"
              size="sm"
              className="min-w-16 bg-background text-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="bg-background"
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="bg-background"
            aria-label="Página siguiente"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
