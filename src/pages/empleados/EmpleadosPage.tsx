import { DataTable } from "@/components/data-table/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { empleadosColumns } from "@/features/empleados/config/empleados.columns";
import { useEmpleados } from "@/features/empleados/hooks/useEmpleados";
import { useEmpleadosFilters } from "@/features/empleados/hooks/useEmpleadosFilters";
import type { Empleado } from "@/features/empleados/types/empleados.types";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";

const NO_EMPLEADOS: Empleado[] = [];

export default function EmpleadosPage() {
  const { filters, setPage } = useEmpleadosFilters();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useEmpleados(filters);

  const pagination: PaginationState = {
    pageIndex: filters.page - 1,
    pageSize: filters.limit,
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;

    setPage(next.pageIndex + 1);
  };

  return (
    <section className="space-y-4" aria-labelledby="empleados-title">
      <h1 id="empleados-title" className="text-2xl font-semibold">
        Empleados
      </h1>

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar la lista de empleados</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            {getApiErrorMessage(error)}
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={empleadosColumns}
        data={data?.items ?? NO_EMPLEADOS}
        pagination={pagination}
        rowCount={data?.pagination.total ?? 0}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No se encontraron empleados"
      />
    </section>
  );
}
