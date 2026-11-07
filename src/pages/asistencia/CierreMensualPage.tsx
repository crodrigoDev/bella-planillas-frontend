import { useState } from "react";
import { CheckIcon, PlayIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AprobarMesModal } from "@/features/asistencia/components/cierre/AprobarMesModal";
import { CierreMensualToolbar } from "@/features/asistencia/components/cierre/CierreMensualToolbar";
import { GenerarMesModal } from "@/features/asistencia/components/cierre/GenerarMesModal";
import { ResumenCierre } from "@/features/asistencia/components/cierre/ResumenCierre";
import { AprobarResumenModal } from "@/features/asistencia/components/modals/AprobarResumenModal";
import { getCierreMensualColumns } from "@/features/asistencia/config/cierreMensual.columns";
import { MAX_APROBACION_MES } from "@/features/asistencia/config/cierreMensual.config";
import { useCierreMensualFilters } from "@/features/asistencia/hooks/useCierreMensualFilters";
import {
  useConteoIncidencias,
  useIncidencias,
} from "@/features/asistencia/hooks/useIncidencias";
import type { Incidencia } from "@/features/asistencia/types/incidencias.types";
import { formatPeriodo } from "@/features/asistencia/utils/asistencia.utils";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import { usePaginacionServidor } from "@/hooks/usePaginacionServidor";
import { getOptionLabel } from "@/lib/catalogos.utils";

const NO_INCIDENCIAS: Incidencia[] = [];

/** Modal abierto de la página; aprobar una fila lleva a su colaborador */
type ModalAbierto =
  | { tipo: "generar" }
  | { tipo: "aprobarMes" }
  | { tipo: "aprobarFila"; incidencia: Incidencia };

/**
 * Cierre mensual de asistencia: genera y aprueba el mes de todos los colaboradores
 *
 * @remarks
 * Los filtros viven en la URL. Las áreas las trae esta página y se pasan por
 * props, porque asistencia no importa de empleados. Aprobar el mes aprueba los
 * pendientes de todas las áreas (el backend no filtra), por eso su cifra no
 * depende del filtro de área.
 */
export default function CierreMensualPage() {
  const {
    filters,
    hasActiveFilters,
    setPage,
    setLimit,
    setFilter,
    setPeriodo,
    clearFilters,
  } = useCierreMensualFilters();
  const [modal, setModal] = useState<ModalAbierto | null>(null);
  const { areas } = useEmpleadosCatalogos();
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useIncidencias(filters);
  const conteoVista = useConteoIncidencias(filters.periodo, filters.area_id);
  // Sin filtro de área comparte la consulta con la de arriba
  const conteoMes = useConteoIncidencias(filters.periodo);

  const { pagination, onPaginationChange } = usePaginacionServidor({
    page: filters.page,
    limit: filters.limit,
    totalPages: isPlaceholderData ? undefined : data?.pagination.totalPages,
    setPage,
    setLimit,
  });

  const columns = getCierreMensualColumns((incidencia) =>
    setModal({ tipo: "aprobarFila", incidencia }),
  );

  const pendientesMes = conteoMes.data?.PENDIENTE ?? 0;
  const motivoNoAprobarMes =
    pendientesMes === 0
      ? "No hay resúmenes pendientes en este mes."
      : pendientesMes > MAX_APROBACION_MES
        ? `Hay más de ${MAX_APROBACION_MES} pendientes: apruébalos por colaborador.`
        : null;
  const areaNombre = filters.area_id
    ? getOptionLabel(areas.data ?? [], filters.area_id)
    : undefined;

  const openGenerar = () => setModal({ tipo: "generar" });
  const handleOpenChange = (open: boolean) => {
    if (!open) setModal(null);
  };

  const sinResumenes =
    !isLoading && !error && !hasActiveFilters && data?.pagination.total === 0;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="cierre-mensual-title"
    >
      <PageHeader
        id="cierre-mensual-title"
        title="Cierre mensual"
        description="Genera y aprueba el resumen de asistencia del mes de todos los colaboradores"
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={openGenerar}>
              <PlayIcon data-icon="inline-start" />
              Generar mes
            </Button>
            <Tooltip>
              {/* El span deja que el tooltip funcione aunque el botón esté deshabilitado */}
              <TooltipTrigger render={<span />}>
                <Button
                  disabled={motivoNoAprobarMes !== null}
                  onClick={() => setModal({ tipo: "aprobarMes" })}
                >
                  <CheckIcon data-icon="inline-start" />
                  Aprobar mes
                </Button>
              </TooltipTrigger>
              {motivoNoAprobarMes && (
                <TooltipContent>{motivoNoAprobarMes}</TooltipContent>
              )}
            </Tooltip>
          </div>
        }
      />

      <CierreMensualToolbar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        areas={areas.data}
        areasLoading={areas.isLoading}
        onPeriodoChange={setPeriodo}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      <ResumenCierre conteo={conteoVista.data} />

      <ErrorAlert
        error={error}
        title="No se pudo cargar el cierre del mes"
        onRetry={() => refetch()}
      />

      {sinResumenes ? (
        <EmptyState
          title={`Sin resúmenes de ${formatPeriodo(filters.periodo)}`}
          description="Todavía no se calculó la asistencia de este mes. Genera el mes para revisarlo y aprobarlo."
          action={<Button onClick={openGenerar}>Generar mes</Button>}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? NO_INCIDENCIAS}
          pagination={pagination}
          rowCount={data?.pagination.total ?? 0}
          onPaginationChange={onPaginationChange}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyMessage="No hay resúmenes con estos filtros"
          itemLabel="resúmenes"
        />
      )}

      <GenerarMesModal
        periodo={filters.periodo}
        areaId={filters.area_id}
        areaNombre={areaNombre}
        open={modal?.tipo === "generar"}
        onOpenChange={handleOpenChange}
      />
      <AprobarMesModal
        periodo={filters.periodo}
        pendientes={pendientesMes}
        open={modal?.tipo === "aprobarMes"}
        onOpenChange={handleOpenChange}
      />
      <AprobarResumenModal
        empleadoId={
          modal?.tipo === "aprobarFila" ? modal.incidencia.empleado_id : ""
        }
        periodo={filters.periodo}
        open={modal?.tipo === "aprobarFila"}
        onOpenChange={handleOpenChange}
      />
    </section>
  );
}
