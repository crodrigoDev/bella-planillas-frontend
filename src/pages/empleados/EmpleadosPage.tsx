import { useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ROUTE_PATHS } from "@/app/routes/path";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { DataTable } from "@/components/data-table/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmpleadosToolbar } from "@/features/empleados/components/EmpleadosToolbar";
import { empleadosColumns } from "@/features/empleados/config/empleados.columns";
import { useEmpleados } from "@/features/empleados/hooks/useEmpleados";
import { useEmpleadosFilters } from "@/features/empleados/hooks/useEmpleadosFilters";
import type { Empleado } from "@/features/empleados/types/empleados.types";

const NO_EMPLEADOS: Empleado[] = [];

/**
 * Lista los empleados con paginación del servidor, búsqueda y filtros
 *
 * @remarks
 * No guarda los filtros: los recibe de la URL y avisa cuando cambian.
 */
export default function EmpleadosPage() {
  const {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    setFilter,
    clearFilters,
  } = useEmpleadosFilters();
  const {
    data,
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useEmpleados(filters);

  useEffect(() => {
    if (!data || isPlaceholderData) return;

    const lastPage = Math.max(data.pagination.totalPages, 1);

    if (filters.page > lastPage) setPage(lastPage, true);
  }, [data, isPlaceholderData, filters.page, setPage]);

  const pagination: PaginationState = {
    pageIndex: filters.page - 1,
    pageSize: filters.limit,
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;

    // Cambiar las filas por página reinicia a la primera página
    if (next.pageSize !== pagination.pageSize) setLimit(next.pageSize);
    else setPage(next.pageIndex + 1);
  };

  return (
    <section className="space-y-4" aria-labelledby="empleados-title">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 id="empleados-title" className="text-2xl font-semibold">
            Empleados
          </h1>
          <p className="text-sm text-muted-foreground">
            Colaboradores de la empresa
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link to={ROUTE_PATHS.gestionPersonal.nuevoEmpleado} />}
        >
          <PlusIcon data-icon="inline-start" />
          Nuevo empleado
        </Button>
      </header>

      <EmpleadosToolbar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

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
        itemLabel="colaboradores"
      />
    </section>
  );
}
