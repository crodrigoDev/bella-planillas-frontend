import { useEffect, useState } from "react";
import { PlusIcon, UploadIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ROUTE_PATHS } from "@/app/routes/path";
import { DataTable } from "@/components/data-table/DataTable";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { MarcacionesToolbar } from "@/features/asistencia/components/marcaciones/MarcacionesToolbar";
import { RegistrarMarcacionModal } from "@/features/asistencia/components/marcaciones/RegistrarMarcacionModal";
import { marcacionesColumns } from "@/features/asistencia/config/marcaciones.columns";
import { useMarcaciones } from "@/features/asistencia/hooks/useMarcaciones";
import { useMarcacionesFilters } from "@/features/asistencia/hooks/useMarcacionesFilters";
import type {
  EmpleadoMarcableOption,
  Marcacion,
} from "@/features/asistencia/types/marcaciones.types";
import { useEmpleadosActivos } from "@/features/empleados/hooks/useCatalogos";
import type { SelectOption } from "@/lib/types/options.types";

const NO_MARCACIONES: Marcacion[] = [];
const NO_OPTIONS: SelectOption[] = [];
const NO_EMPLEADOS: EmpleadoMarcableOption[] = [];

/**
 * Lista todas las marcaciones con paginación del servidor y filtros
 *
 * @remarks
 * No guarda los filtros: los recibe de la URL. Los empleados del filtro los
 * trae esta página y se los pasa a la barra, porque asistencia no importa de empleados.
 */
export default function MarcacionesPage() {
  const {
    filters,
    queryFilters,
    rangoInvalido,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    setFechas,
    clearFilters,
  } = useMarcacionesFilters();
  const [registrando, setRegistrando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const empleados = useEmpleadosActivos();
  const empleadosBusqueda = useEmpleadosActivos(busqueda);
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useMarcaciones(queryFilters);

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
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="marcaciones-title"
    >
      <PageHeader
        id="marcaciones-title"
        title="Marcaciones"
        description="Registro de entradas y salidas de todos los colaboradores"
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link to={ROUTE_PATHS.asistencia.importarMarcaciones} />}
            >
              <UploadIcon data-icon="inline-start" />
              Importar
            </Button>
            <Button onClick={() => setRegistrando(true)}>
              <PlusIcon data-icon="inline-start" />
              Registrar marcación
            </Button>
          </div>
        }
      />

      <MarcacionesToolbar
        filters={filters}
        rangoInvalido={rangoInvalido}
        hasActiveFilters={hasActiveFilters}
        empleados={empleados.data ?? NO_OPTIONS}
        empleadosLoading={empleados.isLoading}
        onFilterChange={setFilter}
        onFechasChange={setFechas}
        onClear={clearFilters}
      />

      <ErrorAlert
        error={error}
        title="No se pudo cargar la lista de marcaciones"
        onRetry={() => refetch()}
      />

      <DataTable
        columns={marcacionesColumns}
        data={data?.items ?? NO_MARCACIONES}
        pagination={pagination}
        rowCount={data?.pagination.total ?? 0}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={
          hasActiveFilters
            ? "No hay marcaciones con estos filtros"
            : "Todavía no hay marcaciones registradas"
        }
        itemLabel="marcaciones"
      />

      <RegistrarMarcacionModal
        empleados={empleadosBusqueda.data ?? NO_EMPLEADOS}
        empleadosLoading={empleadosBusqueda.isFetching}
        onSearchChange={setBusqueda}
        open={registrando}
        onOpenChange={(open) => {
          setRegistrando(open);
          if (!open) setBusqueda("");
        }}
      />
    </section>
  );
}
