import { useState } from "react";
import { PlusIcon, UploadIcon } from "lucide-react";
import { Link } from "react-router-dom";
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
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";
import { getNombreCompleto } from "@/features/empleados/utils/empleados.utils";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";

const NO_MARCACIONES: Marcacion[] = [];
const NO_EMPLEADOS: EmpleadoMarcableOption[] = [];

/**
 * Lista todas las marcaciones con paginación del servidor y filtros
 *
 * @remarks
 * No guarda los filtros: los recibe de la URL. Los empleados (la búsqueda del filtro
 * y del modal, que comparten consulta, y el nombre del filtrado) los trae esta página
 * y se los pasa a los componentes, porque asistencia no importa de empleados.
 */
export default function MarcacionesPage() {
  const {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    setFechas,
    clearFilters,
  } = useMarcacionesFilters();
  const [registrando, setRegistrando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const empleados = useEmpleadosActivos(busqueda);
  const colaborador = useEmpleado(filters.empleado_id);
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useMarcaciones(filters);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

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
        hasActiveFilters={hasActiveFilters}
        empleados={empleados.data ?? NO_EMPLEADOS}
        empleadosLoading={empleados.isFetching}
        colaboradorNombre={
          colaborador.data ? getNombreCompleto(colaborador.data) : undefined
        }
        onEmpleadoSearchChange={setBusqueda}
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
        onPaginationChange={onPaginationChange}
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
        empleados={empleados.data ?? NO_EMPLEADOS}
        empleadosLoading={empleados.isFetching}
        onSearchChange={setBusqueda}
        open={registrando}
        onOpenChange={(open) => {
          setRegistrando(open);
          // Cada selector empieza sin texto de búsqueda
          setBusqueda("");
        }}
      />
    </section>
  );
}
