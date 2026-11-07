import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { buildEditarJornadaPath, ROUTE_PATHS } from "@/app/routes/path";
import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import { DesactivarJornadaModal } from "@/features/jornadas/components/modals/DesactivarJornadaModal";
import { JornadasToolbar } from "@/features/jornadas/components/listado/JornadasToolbar";
import { getJornadasColumns } from "@/features/jornadas/config/jornadas.columns";
import { useJornadas } from "@/features/jornadas/hooks/useJornadas";
import { useJornadasFilters } from "@/features/jornadas/hooks/useJornadasFilters";
import type { Jornada } from "@/features/jornadas/types/jornadas.types";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";

const NO_JORNADAS: Jornada[] = [];

/**
 * Listado de jornadas laborales con filtros, edición y desactivación
 *
 * @remarks
 * Los filtros viven en la URL. Las áreas las trae esta página y se pasan por
 * props, porque jornadas no importa de empleados. Una jornada desactivada
 * desaparece del listado y no se puede recuperar desde la app.
 */
export default function JornadasPage() {
  const navigate = useNavigate();
  const {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    clearFilters,
  } = useJornadasFilters();
  const [aDesactivar, setADesactivar] = useState<Jornada | null>(null);
  const { areas } = useEmpleadosCatalogos();
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useJornadas(filters);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

  const columns = getJornadasColumns({
    onEditar: (jornada) => navigate(buildEditarJornadaPath(jornada.id)),
    onDesactivar: setADesactivar,
  });

  const nuevaJornada = (
    <Button
      nativeButton={false}
      render={<Link to={ROUTE_PATHS.asistencia.nuevaJornada} />}
    >
      <PlusIcon data-icon="inline-start" />
      Nueva jornada
    </Button>
  );

  const sinJornadas =
    !isLoading && !error && !hasActiveFilters && data?.pagination.total === 0;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="jornadas-title"
    >
      <PageHeader
        id="jornadas-title"
        title="Jornadas"
        description="Define los horarios laborales que se asignan a los colaboradores"
        action={nuevaJornada}
      />

      <JornadasToolbar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        areas={areas.data}
        areasLoading={areas.isLoading}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      <ErrorAlert
        error={error}
        title="No se pudieron cargar las jornadas"
        onRetry={() => refetch()}
      />

      {sinJornadas ? (
        <EmptyState
          title="Todavía no hay jornadas"
          description="Crea la primera jornada para poder asignarla a los colaboradores."
          action={nuevaJornada}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? NO_JORNADAS}
          pagination={pagination}
          rowCount={data?.pagination.total ?? 0}
          onPaginationChange={onPaginationChange}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyMessage="No hay jornadas con estos filtros"
          itemLabel="jornadas"
        />
      )}

      <DesactivarJornadaModal
        jornada={aDesactivar}
        open={aDesactivar !== null}
        onOpenChange={(open) => {
          if (!open) setADesactivar(null);
        }}
      />
    </section>
  );
}
