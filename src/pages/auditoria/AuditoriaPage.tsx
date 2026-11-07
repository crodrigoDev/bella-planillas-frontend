import { useState } from "react";

import { DataTable } from "@/components/data-table/DataTable";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { AuditoriaToolbar } from "@/features/auditoria/components/listado/AuditoriaToolbar";
import { CambiosAuditoriaModal } from "@/features/auditoria/components/modals/CambiosAuditoriaModal";
import { getAuditoriaColumns } from "@/features/auditoria/config/auditoria.columns";
import { useAuditoria } from "@/features/auditoria/hooks/useAuditoria";
import { useAuditoriaFilters } from "@/features/auditoria/hooks/useAuditoriaFilters";
import type { AuditoriaLog } from "@/features/auditoria/types/auditoria.types";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";

const NO_LOGS: AuditoriaLog[] = [];

/**
 * Bitácora de auditoría: quién cambió qué y cuándo, de solo lectura
 *
 * @remarks
 * Los filtros viven en la URL. Los registros los escribe un trigger de la base
 * de datos solo para algunas tablas. No hay filtro de fechas ni búsqueda de
 * texto en el backend.
 */
export default function AuditoriaPage() {
  const {
    filters,
    usuarioEmail,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    filtrarPorUsuario,
    quitarUsuario,
    quitarRegistro,
    clearFilters,
  } = useAuditoriaFilters();
  const [verCambios, setVerCambios] = useState<AuditoriaLog | null>(null);
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useAuditoria(filters);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

  const columns = getAuditoriaColumns({
    onVerCambios: setVerCambios,
    onFiltrarUsuario: filtrarPorUsuario,
  });

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="auditoria-title"
    >
      <PageHeader
        id="auditoria-title"
        title="Auditoría"
        description="Consulta los cambios que se hicieron en el sistema y quién los hizo"
      />

      <AuditoriaToolbar
        filters={filters}
        usuarioEmail={usuarioEmail}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={setFilter}
        onQuitarUsuario={quitarUsuario}
        onQuitarRegistro={quitarRegistro}
        onClear={clearFilters}
      />

      <ErrorAlert
        error={error}
        title="No se pudo cargar la auditoría"
        onRetry={() => refetch()}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? NO_LOGS}
        pagination={pagination}
        rowCount={data?.pagination.total ?? 0}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No hay registros de auditoría con estos filtros"
        itemLabel="registros"
      />

      <CambiosAuditoriaModal
        log={verCambios}
        onOpenChange={(open) => {
          if (!open) setVerCambios(null);
        }}
      />
    </section>
  );
}
