import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { PageHeader } from "@/components/page/PageHeader";
import { ResumenCifra } from "@/components/page/ResumenCifra";
import { Button } from "@/components/ui/button";
import { CambiarEstadoDiaModal } from "@/features/asistencia/components/calendario/CambiarEstadoDiaModal";
import { DiaCalendarioModal } from "@/features/asistencia/components/calendario/DiaCalendarioModal";
import { SelectorAnio } from "@/features/asistencia/components/calendario/SelectorAnio";
import { getCalendarioColumns } from "@/features/asistencia/config/calendario.columns";
import { ORIGEN_DIA_OPTIONS } from "@/features/asistencia/config/calendario.config";
import { useCalendario } from "@/features/asistencia/hooks/useCalendario";
import { useCalendarioFilters } from "@/features/asistencia/hooks/useCalendarioFilters";
import type { DiaCalendarioAsistencia } from "@/features/asistencia/types/calendario.types";
import { usePaginacionLocal } from "@/hooks/usePaginacionLocal";

const NO_DIAS: DiaCalendarioAsistencia[] = [];
const NO_MESES: string[] = [];

/** Modal abierto de la página */
type ModalAbierto =
  | { tipo: "crear" }
  | { tipo: "editar"; dia: DiaCalendarioAsistencia }
  | { tipo: "estado"; dia: DiaCalendarioAsistencia };

/**
 * Calendario de asistencia: feriados nacionales y días de descanso acordados
 *
 * @remarks
 * El año y el origen viven en la URL. El backend devuelve todo el año, así que
 * el filtro por origen se aplica en el cliente. Los feriados nacionales los
 * calcula el motor y son de solo lectura; los acordados se crean y editan aquí.
 */
export default function CalendarioPage() {
  const { filters, setAnio, setOrigen } = useCalendarioFilters();
  const { data, isLoading, isFetching, error, refetch } = useCalendario(
    filters.anio,
  );
  const [modal, setModal] = useState<ModalAbierto | null>(null);

  const dias = data?.dias ?? NO_DIAS;
  const visibles = filters.origen
    ? dias.filter((dia) => dia.origen === filters.origen)
    : dias;

  const nacionales = dias.filter((dia) => dia.origen === "NACIONAL").length;
  const acordadosActivos = dias.filter(
    (dia) => dia.origen === "ADICIONAL" && dia.activo,
  ).length;

  const columns = getCalendarioColumns(
    (dia) => setModal({ tipo: "editar", dia }),
    (dia) => setModal({ tipo: "estado", dia }),
  );

  const openCrear = () => setModal({ tipo: "crear" });
  const handleOpenChange = (open: boolean) => {
    if (!open) setModal(null);
  };

  const sinDias = !isLoading && !error && visibles.length === 0;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-labelledby="calendario-title"
    >
      <PageHeader
        id="calendario-title"
        title="Calendario"
        description="Feriados nacionales y días de descanso acordados que se aplican a todos los colaboradores"
        action={
          <Button onClick={openCrear}>
            <PlusIcon data-icon="inline-start" />
            Agregar día
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <SelectorAnio anio={filters.anio} onChange={setAnio} />
        <FilterSelect
          ariaLabel="Filtrar por origen"
          allLabel="Todos los orígenes"
          options={ORIGEN_DIA_OPTIONS}
          value={filters.origen}
          onChange={setOrigen}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ResumenCifra
          label="Feriados nacionales"
          value={data ? nacionales : "--"}
        />
        <ResumenCifra
          label="Días acordados activos"
          value={data ? acordadosActivos : "--"}
        />
        <ResumenCifra
          label="Meses cerrados"
          value={data ? data.meses_cerrados.length : "--"}
        />
      </div>

      <ErrorAlert
        error={error}
        title="No se pudo cargar el calendario"
        onRetry={() => refetch()}
      />

      {sinDias ? (
        <EmptyState
          title={
            filters.origen
              ? "No hay días con este origen"
              : `Sin días en el calendario de ${filters.anio}`
          }
          description={
            filters.origen
              ? "Prueba con otro filtro de origen."
              : "Todavía no hay feriados ni días acordados para este año. Agrega un día para que se aplique a todos los colaboradores."
          }
          action={
            filters.origen ? undefined : (
              <Button onClick={openCrear}>Agregar día</Button>
            )
          }
        />
      ) : (
        // Se remonta al cambiar el año o el origen para volver a la primera página
        <CalendarioTabla
          key={`${filters.anio}-${filters.origen ?? "todos"}`}
          dias={visibles}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      )}

      <DiaCalendarioModal
        dia={modal?.tipo === "editar" ? modal.dia : null}
        mesesCerrados={data?.meses_cerrados ?? NO_MESES}
        dias={dias}
        open={modal?.tipo === "crear" || modal?.tipo === "editar"}
        onOpenChange={handleOpenChange}
      />
      <CambiarEstadoDiaModal
        dia={modal?.tipo === "estado" ? modal.dia : null}
        open={modal?.tipo === "estado"}
        onOpenChange={handleOpenChange}
      />
    </section>
  );
}

interface CalendarioTablaProps {
  dias: DiaCalendarioAsistencia[];
  columns: ReturnType<typeof getCalendarioColumns>;
  isLoading: boolean;
  isFetching: boolean;
}

/** Tabla del calendario, paginada en el navegador porque el backend trae el año completo */
function CalendarioTabla({
  dias,
  columns,
  isLoading,
  isFetching,
}: CalendarioTablaProps) {
  const { pagination, onPaginationChange, pageItems, rowCount } =
    usePaginacionLocal(dias);

  return (
    <DataTable
      columns={columns}
      data={pageItems}
      pagination={pagination}
      rowCount={rowCount}
      onPaginationChange={onPaginationChange}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyMessage="No hay días con estos filtros"
      itemLabel="días"
    />
  );
}
