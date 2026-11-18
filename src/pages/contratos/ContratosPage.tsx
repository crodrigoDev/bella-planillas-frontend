import { DataTable } from "@/components/data-table/DataTable";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { ContratosToolbar } from "@/features/contratos/components/listado/ContratosToolbar";
import { contratosColumns } from "@/features/contratos/config/contratos.columns";
import { useContratos } from "@/features/contratos/hooks/useContratos";
import { useContratosFilters } from "@/features/contratos/hooks/useContratosFilters";
import type { ContratoGlobal } from "@/features/contratos/types/contratos.types";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";
import type { SelectOption } from "@/lib/types/options.types";

const NO_CONTRATOS: ContratoGlobal[] = [];
const NO_AREAS: SelectOption[] = [];

/**
 * Lista los contratos de todos los colaboradores con paginación del servidor y filtros
 *
 * @remarks
 * No guarda los filtros: los recibe de la URL. Las áreas del filtro las trae
 * esta página y se las pasa a la barra, porque contratos no importa de
 * empleados. Aquí no se crea ni se renueva un contrato: eso se hace desde la
 * ficha, que sabe si el colaborador está activo.
 */
export default function ContratosPage() {
  const {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    setFilter,
    clearFilters,
  } = useContratosFilters();
  const { areas } = useEmpleadosCatalogos();
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useContratos(filters);

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
      aria-labelledby="contratos-title"
    >
      <PageHeader
        id="contratos-title"
        title="Contratos"
        description="Contratos de todos los colaboradores"
      />

      <ContratosToolbar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        areas={areas.data ?? NO_AREAS}
        areasLoading={areas.isLoading}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      <ErrorAlert
        error={error}
        title="No se pudo cargar la lista de contratos"
        onRetry={() => refetch()}
      />

      <DataTable
        columns={contratosColumns}
        data={data?.items ?? NO_CONTRATOS}
        pagination={pagination}
        rowCount={data?.pagination.total ?? 0}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={
          hasActiveFilters
            ? "No hay contratos con estos filtros"
            : "Todavía no hay contratos registrados"
        }
        itemLabel="contratos"
      />
    </section>
  );
}
