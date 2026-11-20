import { useState } from "react";
import { useLocation } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { DataTable } from "@/components/data-table/DataTable";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { AuditoriaToolbar } from "@/features/auditoria/components/listado/AuditoriaToolbar";
import { getAuditoriaColumns } from "@/features/auditoria/config/auditoria.columns";
import { useAuditoria } from "@/features/auditoria/hooks/useAuditoria";
import { useAuditoriaFilters } from "@/features/auditoria/hooks/useAuditoriaFilters";
import { useUsuariosBusqueda } from "@/features/auditoria/hooks/useUsuariosBusqueda";
import type { FilaActividad } from "@/features/auditoria/types/auditoria.types";
import { useEmpleadosActivos } from "@/features/empleados/hooks/useCatalogos";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";
import type { ColaboradorOption } from "@/lib/types/options.types";

const NO_FILAS: FilaActividad[] = [];
const NO_EMPLEADOS: ColaboradorOption[] = [];

/**
 * Auditoría: quién hizo qué, a quién afectó y cuándo, de solo lectura
 *
 * @remarks
 * Los filtros viven en la URL. Cada fila ya viene explicada en lenguaje de
 * negocio por el backend (`resumen`, afectado y autor); los valores antes y
 * después están en la página de detalle de cada fila, a la que se llega con el
 * listado y sus filtros como punto de retorno. No hay búsqueda de texto en el
 * backend. Los colaboradores afectados y los usuarios que hicieron los cambios
 * los busca esta página (`useEmpleadosActivos` y `useUsuariosBusqueda`) y los
 * pasa a la barra, porque auditoría no importa de empleados.
 */
export default function AuditoriaPage() {
  const {
    filters,
    usuarioNombre,
    afectadoNombre,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    setFechas,
    filtrarPorUsuario,
    quitarUsuario,
    filtrarPorAfectado,
    quitarAfectado,
    clearFilters,
  } = useAuditoriaFilters();
  const [busquedaAfectado, setBusquedaAfectado] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const empleados = useEmpleadosActivos(busquedaAfectado);
  const usuarios = useUsuariosBusqueda(busquedaUsuario);
  const { search } = useLocation();
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
    volverA: `${ROUTE_PATHS.auditoria}${search}`,
    onFiltrarUsuario: filtrarPorUsuario,
    onFiltrarAfectado: filtrarPorAfectado,
  });

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="auditoria-title"
    >
      <PageHeader
        id="auditoria-title"
        title="Auditoría"
        description="Consulta quién hizo cada cambio, a quién afectó y qué cambió"
      />

      <AuditoriaToolbar
        filters={filters}
        empleados={empleados.data ?? NO_EMPLEADOS}
        empleadosLoading={empleados.isFetching}
        usuarios={usuarios.data ?? NO_EMPLEADOS}
        usuariosLoading={usuarios.isFetching}
        usuarioNombre={usuarioNombre}
        afectadoNombre={afectadoNombre}
        hasActiveFilters={hasActiveFilters}
        onAfectadoSearchChange={setBusquedaAfectado}
        onUsuarioSearchChange={setBusquedaUsuario}
        onFilterChange={setFilter}
        onFechasChange={setFechas}
        onFiltrarUsuario={filtrarPorUsuario}
        onQuitarUsuario={quitarUsuario}
        onFiltrarAfectado={filtrarPorAfectado}
        onQuitarAfectado={quitarAfectado}
        onClear={clearFilters}
      />

      <ErrorAlert
        error={error}
        title="No se pudo cargar la auditoría"
        onRetry={() => refetch()}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? NO_FILAS}
        pagination={pagination}
        rowCount={data?.pagination.total ?? 0}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No hay actividad registrada con estos filtros"
        itemLabel="movimientos"
      />
    </section>
  );
}
