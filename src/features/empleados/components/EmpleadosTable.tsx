import { SearchX } from "lucide-react";
import DataTable from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import type { EmpleadoListado } from "../types/empleados.types";
import { getEmpleadosColumns } from "../config/empleados.columns";

interface EmpleadosTableProps {
  empleados: EmpleadoListado[];
  canManage: boolean;
  onReset: () => void;
}

/** Presenta los empleados con sus columnas y acciones */
export default function EmpleadosTable({
  empleados,
  canManage,
  onReset,
}: EmpleadosTableProps) {
  const columns = getEmpleadosColumns(canManage);

  return (
    <DataTable
      columns={columns}
      data={empleados}
      getRowId={(empleado) => empleado.id}
      caption="Listado de empleados y su situación laboral"
      className="min-w-240"
      emptyState={
        <>
          <SearchX
            aria-hidden="true"
            className="mx-auto mb-3 size-7 text-muted-foreground/50"
          />
          <p className="font-medium text-foreground">
            No se encontraron empleados
          </p>
          <p className="mt-1 text-xs">
            Prueba otra búsqueda o cambia los filtros
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={onReset}
          >
            Limpiar filtros
          </Button>
        </>
      }
    />
  );
}
