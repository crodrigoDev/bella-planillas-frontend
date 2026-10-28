import { useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ROUTE_PATHS } from "@/app/routes/path";
import { DataTable } from "@/components/data-table/DataTable";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { EmpleadosToolbar } from "@/features/empleados/components/listado/EmpleadosToolbar";
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
      <PageHeader
        id="empleados-title"
        title="Empleados"
        description="Colaboradores de la empresa"
        action={
          <Button
            nativeButton={false}
            render={<Link to={ROUTE_PATHS.gestionPersonal.nuevoEmpleado} />}
          >
            <PlusIcon data-icon="inline-start" />
            Nuevo empleado
          </Button>
        }
      />

      <EmpleadosToolbar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      {isError && (
        <ErrorAlert
          error={error}
          title="No se pudo cargar la lista de empleados"
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          }
        />
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
