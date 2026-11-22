import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { AreasToolbar } from "@/features/areas/components/listado/AreasToolbar";
import { AreaFormModal } from "@/features/areas/components/modals/AreaFormModal";
import { DesactivarAreaModal } from "@/features/areas/components/modals/DesactivarAreaModal";
import { getAreasColumns } from "@/features/areas/config/areas.columns";
import { useAreas } from "@/features/areas/hooks/useAreas";
import { useAreasFilters } from "@/features/areas/hooks/useAreasFilters";
import type { AreaResumenDto } from "@/features/areas/types/areas.types";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";

const NO_AREAS: AreaResumenDto[] = [];

/**
 * Listado de áreas con búsqueda, creación, edición y desactivación
 *
 * @remarks
 * Los filtros viven en la URL. Un área desactivada desaparece del listado y
 * no se puede recuperar desde la app.
 */
export default function AreasPage() {
  const {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    clearFilters,
  } = useAreasFilters();

  const [formModal, setFormModal] = useState<{
    open: boolean;
    area: AreaResumenDto | null;
  }>({ open: false, area: null });
  const [desactivarModal, setDesactivarModal] = useState<{
    open: boolean;
    area: AreaResumenDto | null;
  }>({ open: false, area: null });

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useAreas(filters);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

  const handleNueva = () => {
    setFormModal({ open: true, area: null });
  };

  const handleEditar = (area: AreaResumenDto) => {
    setFormModal({ open: true, area });
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormModal((prev) => ({ ...prev, open }));
  };

  const handleDesactivar = (area: AreaResumenDto) => {
    setDesactivarModal({ open: true, area });
  };

  const handleDesactivarOpenChange = (open: boolean) => {
    setDesactivarModal((prev) => ({ ...prev, open }));
  };

  const columns = getAreasColumns({
    onEditar: handleEditar,
    onDesactivar: handleDesactivar,
  });

  const nuevaArea = (
    <Button onClick={handleNueva}>
      <PlusIcon data-icon="inline-start" />
      Nueva área
    </Button>
  );

  const sinAreas =
    !isLoading && !error && !hasActiveFilters && data?.pagination.total === 0;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="areas-title"
    >
      <PageHeader
        id="areas-title"
        title="Áreas"
        description="Organiza las áreas de la empresa y revisa cuántos colaboradores, cargos y jornadas tiene cada una"
        action={nuevaArea}
      />

      <AreasToolbar
        search={filters.search}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onClear={clearFilters}
      />

      <ErrorAlert
        error={error}
        title="No se pudieron cargar las áreas"
        onRetry={() => refetch()}
      />

      {sinAreas ? (
        <EmptyState
          title="Todavía no hay áreas"
          description="Crea la primera área para organizar los cargos, jornadas y colaboradores."
          action={nuevaArea}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? NO_AREAS}
          pagination={pagination}
          rowCount={data?.pagination.total ?? 0}
          onPaginationChange={onPaginationChange}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyMessage="No hay áreas con estos filtros"
          itemLabel="áreas"
        />
      )}

      <AreaFormModal
        area={formModal.area}
        open={formModal.open}
        onOpenChange={handleFormOpenChange}
      />

      <DesactivarAreaModal
        area={desactivarModal.area}
        open={desactivarModal.open}
        onOpenChange={handleDesactivarOpenChange}
      />
    </section>
  );
}
