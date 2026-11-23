import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { CargosToolbar } from "@/features/cargos/components/listado/CargosToolbar";
import { CargoFormModal } from "@/features/cargos/components/modals/CargoFormModal";
import { DesactivarCargoModal } from "@/features/cargos/components/modals/DesactivarCargoModal";
import { getCargosColumns } from "@/features/cargos/config/cargos.columns";
import { useCargos } from "@/features/cargos/hooks/useCargos";
import { useCargosFilters } from "@/features/cargos/hooks/useCargosFilters";
import type { CargoResumenDto } from "@/features/cargos/types/cargos.types";
import { useAreasCatalogo } from "@/features/empleados/hooks/useCatalogos";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";
import type { SelectOption } from "@/lib/types/options.types";

const NO_CARGOS: CargoResumenDto[] = [];
const NO_AREAS: SelectOption[] = [];

/**
 * Listado de cargos con búsqueda, filtro por área, creación, edición y desactivación
 *
 * @remarks
 * Los filtros viven en la URL. Esta página trae las áreas y las pasa por props
 * porque la feature cargos no puede importar de otra feature. Un cargo desactivado
 * desaparece del listado y no se puede recuperar desde la app.
 */
export default function CargosPage() {
  const {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    setAreaId,
    clearFilters,
  } = useCargosFilters();

  const [formModal, setFormModal] = useState<{
    open: boolean;
    cargo: CargoResumenDto | null;
  }>({ open: false, cargo: null });
  const [desactivarModal, setDesactivarModal] = useState<{
    open: boolean;
    cargo: CargoResumenDto | null;
  }>({ open: false, cargo: null });

  const areas = useAreasCatalogo();
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useCargos(filters);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

  const handleNuevo = () => {
    setFormModal({ open: true, cargo: null });
  };

  const handleEditar = (cargo: CargoResumenDto) => {
    setFormModal({ open: true, cargo });
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormModal((prev) => ({ ...prev, open }));
  };

  const handleDesactivar = (cargo: CargoResumenDto) => {
    setDesactivarModal({ open: true, cargo });
  };

  const handleDesactivarOpenChange = (open: boolean) => {
    setDesactivarModal((prev) => ({ ...prev, open }));
  };

  const columns = getCargosColumns({
    onEditar: handleEditar,
    onDesactivar: handleDesactivar,
  });

  const areaOptions = areas.data ?? NO_AREAS;

  const nuevoCargo = (
    <Button onClick={handleNuevo}>
      <PlusIcon data-icon="inline-start" />
      Nuevo cargo
    </Button>
  );

  const sinCargos =
    !isLoading && !error && !hasActiveFilters && data?.pagination.total === 0;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="cargos-title"
    >
      <PageHeader
        id="cargos-title"
        title="Cargos"
        description="Define los cargos de cada área y su banda salarial"
        action={nuevoCargo}
      />

      <CargosToolbar
        search={filters.search}
        areaId={filters.id_area}
        hasActiveFilters={hasActiveFilters}
        areas={areaOptions}
        areasLoading={areas.isLoading}
        onSearchChange={setSearch}
        onAreaChange={setAreaId}
        onClear={clearFilters}
      />

      <ErrorAlert
        error={error}
        title="No se pudieron cargar los cargos"
        onRetry={() => refetch()}
      />

      {sinCargos ? (
        <EmptyState
          title="Todavía no hay cargos"
          description="Crea el primer cargo para definir los puestos de cada área y su banda salarial."
          action={nuevoCargo}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? NO_CARGOS}
          pagination={pagination}
          rowCount={data?.pagination.total ?? 0}
          onPaginationChange={onPaginationChange}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyMessage="No hay cargos con estos filtros"
          itemLabel="cargos"
        />
      )}

      <CargoFormModal
        cargo={formModal.cargo}
        areas={areaOptions}
        areasLoading={areas.isLoading}
        open={formModal.open}
        onOpenChange={handleFormOpenChange}
      />

      <DesactivarCargoModal
        cargo={desactivarModal.cargo}
        open={desactivarModal.open}
        onOpenChange={handleDesactivarOpenChange}
      />
    </section>
  );
}
