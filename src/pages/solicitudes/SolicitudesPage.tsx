import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { buildSolicitudPath, ROUTE_PATHS } from "@/app/routes/path";
import { DataTable } from "@/components/data-table/DataTable";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import { SolicitudModales } from "@/features/solicitudes/components/modals/SolicitudModales";
import { EstadoTabs } from "@/features/solicitudes/components/listado/EstadoTabs";
import { SolicitudesToolbar } from "@/features/solicitudes/components/listado/SolicitudesToolbar";
import { getSolicitudesColumns } from "@/features/solicitudes/config/solicitudes.columns";
import { useSolicitudes } from "@/features/solicitudes/hooks/useSolicitudes";
import { useSolicitudesFilters } from "@/features/solicitudes/hooks/useSolicitudesFilters";
import type {
  AccionSolicitud,
  Solicitud,
} from "@/features/solicitudes/types/solicitudes.types";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";

const NO_SOLICITUDES: Solicitud[] = [];

/**
 * Listado de solicitudes de los colaboradores, con pestañas por estado y filtros
 *
 * @remarks
 * Los filtros (y el estado de la pestaña) viven en la URL. Las áreas las trae
 * esta página y se pasan por props, porque solicitudes no importa de empleados.
 * Los conteos de las pestañas ignoran el filtro de estado.
 */
export default function SolicitudesPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [accionRapida, setAccionRapida] = useState<{
    solicitud: Solicitud;
    accion: AccionSolicitud;
  } | null>(null);
  const {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    setFechas,
    clearFilters,
  } = useSolicitudesFilters();
  const { areas } = useEmpleadosCatalogos();
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useSolicitudes(filters);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

  const columns = getSolicitudesColumns({
    onVerDetalle: (solicitud) => navigate(buildSolicitudPath(solicitud.id)),
    onAccion: (solicitud, accion) => setAccionRapida({ solicitud, accion }),
    userId: session?.usuario.id,
  });

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="solicitudes-title"
    >
      <PageHeader
        id="solicitudes-title"
        title="Solicitudes"
        description="Vacaciones, permisos, licencias y otras solicitudes de los colaboradores"
        action={
          <Button
            nativeButton={false}
            render={<Link to={ROUTE_PATHS.gestionPersonal.nuevaSolicitud} />}
          >
            <PlusIcon data-icon="inline-start" />
            Nueva solicitud
          </Button>
        }
      />

      <SolicitudesToolbar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        areas={areas.data}
        areasLoading={areas.isLoading}
        onFilterChange={setFilter}
        onFechasChange={setFechas}
        onClear={clearFilters}
      />

      <EstadoTabs
        value={filters.estado}
        porEstado={data?.porEstado}
        total={data?.totalSinEstado}
      />

      <ErrorAlert
        error={error}
        title="No se pudieron cargar las solicitudes"
        onRetry={() => refetch()}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? NO_SOLICITUDES}
        pagination={pagination}
        rowCount={data?.pagination.total ?? 0}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={
          hasActiveFilters || filters.estado
            ? "No hay solicitudes con estos filtros"
            : "Todavía no hay solicitudes registradas"
        }
        itemLabel="solicitudes"
      />

      {accionRapida && (
        <SolicitudModales
          solicitud={accionRapida.solicitud}
          colaboradorNombre={accionRapida.solicitud.colaborador.nombre_completo}
          accion={accionRapida.accion}
          onClose={() => setAccionRapida(null)}
        />
      )}
    </section>
  );
}
