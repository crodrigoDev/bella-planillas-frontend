import { PlusIcon, UploadIcon } from "lucide-react";
import { Link } from "react-router-dom";
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
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";

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
    error,
    refetch,
  } = useEmpleados(filters);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4" aria-labelledby="empleados-title">
      <PageHeader
        id="empleados-title"
        title="Empleados"
        description="Colaboradores de la empresa"
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link to={ROUTE_PATHS.gestionPersonal.importarEmpleados} />}
            >
              <UploadIcon data-icon="inline-start" />
              Importar
            </Button>
            <Button
              nativeButton={false}
              render={<Link to={ROUTE_PATHS.gestionPersonal.nuevoEmpleado} />}
            >
              <PlusIcon data-icon="inline-start" />
              Nuevo empleado
            </Button>
          </div>
        }
      />

      <EmpleadosToolbar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      <ErrorAlert
        error={error}
        title="No se pudo cargar la lista de empleados"
        onRetry={() => refetch()}
      />

      <DataTable
        columns={empleadosColumns}
        data={data?.items ?? NO_EMPLEADOS}
        pagination={pagination}
        rowCount={data?.pagination.total ?? 0}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No se encontraron empleados"
        itemLabel="colaboradores"
      />
    </section>
  );
}
