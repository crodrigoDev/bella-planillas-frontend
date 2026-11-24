import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { buildPlanillaPath } from "@/app/routes/path";
import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { AvanceGeneracion } from "@/features/planillas/components/generacion/AvanceGeneracion";
import { GenerarPlanillasModal } from "@/features/planillas/components/generacion/GenerarPlanillasModal";
import { PlanillasToolbar } from "@/features/planillas/components/listado/PlanillasToolbar";
import {
  getNombrePlanilla,
  getPlanillasColumns,
} from "@/features/planillas/config/planillas.columns";
import { PLANILLAS_LIMIT_OPTIONS } from "@/features/planillas/config/planillas.config";
import { usePlanillas } from "@/features/planillas/hooks/usePlanillas";
import { usePlanillasFilters } from "@/features/planillas/hooks/usePlanillasFilters";
import type { PlanillaResumen } from "@/features/planillas/types/planillas.types";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";
import { formatPeriodo } from "@/lib/periodo.utils";

const NO_PLANILLAS: PlanillaResumen[] = [];

/**
 * Listado mensual de planillas con generación y seguimiento de avance
 */
export default function PlanillasPage() {
  const navigate = useNavigate();
  const [modalGenerarAbierto, setModalGenerarAbierto] = useState(false);
  const {
    filters,
    trabajo,
    trabajoPeriodo,
    setPeriodo,
    setPage,
    setLimit,
    setTrabajo,
  } = usePlanillasFilters();

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    usePlanillas(filters);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

  const handleVerDetalle = (planilla: PlanillaResumen) => {
    navigate(buildPlanillaPath(planilla.id), {
      state: { nombre: getNombrePlanilla(planilla) },
    });
  };

  const columns = getPlanillasColumns({ onVerDetalle: handleVerDetalle });

  const generarPlanillasButton = (
    <Button onClick={() => setModalGenerarAbierto(true)}>
      <PlusIcon data-icon="inline-start" />
      Generar planillas
    </Button>
  );

  const mes = formatPeriodo(filters.periodo);
  const sinPlanillas = !isLoading && !error && data?.pagination.total === 0;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="planillas-title"
    >
      <PageHeader
        id="planillas-title"
        title="Planillas"
        description="Genera, revisa y valida la planilla mensual de cada colaborador."
        action={generarPlanillasButton}
      />

      <PlanillasToolbar
        periodo={filters.periodo}
        total={data?.pagination.total}
        onPeriodoChange={setPeriodo}
      />

      {trabajo && (
        <AvanceGeneracion
          trabajoId={trabajo}
          periodo={trabajoPeriodo}
          onCerrar={() => setTrabajo(null)}
        />
      )}

      <ErrorAlert
        error={error}
        title="No se pudieron cargar las planillas"
        onRetry={() => refetch()}
      />

      {sinPlanillas ? (
        <EmptyState
          title={`Aún no hay planillas de ${mes}`}
          description="Genera las planillas del mes para revisar los ingresos, descuentos y montos netos de cada colaborador."
          action={generarPlanillasButton}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.items ?? NO_PLANILLAS}
            pagination={pagination}
            rowCount={data?.pagination.total ?? 0}
            onPaginationChange={onPaginationChange}
            isLoading={isLoading}
            isFetching={isFetching}
            emptyMessage={`Aún no hay planillas de ${mes}`}
            itemLabel="planillas"
            pageSizeOptions={PLANILLAS_LIMIT_OPTIONS}
          />
          <p className="text-xs text-muted-foreground">
            Cada fila es la planilla mensual de un colaborador.
          </p>
        </>
      )}

      <GenerarPlanillasModal
        open={modalGenerarAbierto}
        onOpenChange={setModalGenerarAbierto}
        periodoInicial={filters.periodo}
        onGenerada={(trabajoId, periodo) => setTrabajo(trabajoId, periodo)}
      />
    </section>
  );
}
