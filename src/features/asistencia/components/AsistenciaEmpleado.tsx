import { useState } from "react";
import {
  CalendarClockIcon,
  CheckIcon,
  ClockPlusIcon,
  RefreshCwIcon,
} from "lucide-react";

import { DetalleTabEstado } from "@/components/feedback/DetalleTabEstado";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { AccionButton } from "@/components/page/AccionButton";
import { Button } from "@/components/ui/button";
import type { SelectOption } from "@/lib/types/options.types";
import { useGenerarResumen } from "../hooks/useAsistenciaActions";
import { useResumenMes } from "../hooks/useAsistencia";
import { getPeriodoActual, formatPeriodo } from "../utils/asistencia.utils";
import { DetalleDiarioTabla } from "./DetalleDiarioTabla";
import { AprobarResumenModal } from "./modals/AprobarResumenModal";
import { AsignarJornadaModal } from "./modals/AsignarJornadaModal";
import { MarcacionManualModal } from "./modals/MarcacionManualModal";
import { ResolverDiaModal } from "./modals/ResolverDiaModal";
import {
  ResolverResumenModal,
  type AccionResumen,
} from "./modals/ResolverResumenModal";
import { ResumenMesCards } from "./ResumenMesCards";
import { SelectorMes } from "./SelectorMes";

/** Modal abierto de la pestaña; los que dependen de un día o una acción llevan su dato */
type ModalAbierto =
  | { tipo: "aprobar" }
  | { tipo: "resolverResumen"; accion: AccionResumen }
  | { tipo: "marcacion" }
  | { tipo: "jornada" }
  | { tipo: "dia"; fecha: string };

interface AsistenciaEmpleadoProps {
  empleadoId: string;
  /** Documento del empleado: el backend identifica las marcaciones manuales por él */
  nroDocumento: string;
  /** Inicio de labores del empleado: la jornada no puede empezar antes */
  fechaInicioLabores: string | null;
  /** Jornadas activas; las trae la página, porque el catálogo vive en `empleados` */
  jornadas: SelectOption[] | undefined;
  isLoadingJornadas: boolean;
}

/**
 * Pestaña Asistencia de la ficha: el resumen de un mes y su detalle día por día
 *
 * @remarks
 * El resumen mensual no existe hasta que se genera. RRHH lo revisa y lo
 * aprueba; mientras está aprobado no se pueden registrar marcaciones ni
 * resolver días, hay que reabrirlo. Cada cambio de marcaciones, días o
 * jornada vuelve a calcular el resumen del mes.
 */
export function AsistenciaEmpleado({
  empleadoId,
  nroDocumento,
  fechaInicioLabores,
  jornadas,
  isLoadingJornadas,
}: AsistenciaEmpleadoProps) {
  const [periodo, setPeriodo] = useState(getPeriodoActual);
  const [modal, setModal] = useState<ModalAbierto | null>(null);

  const { data, isLoading, error, refetch } = useResumenMes(
    empleadoId,
    periodo,
  );
  const generar = useGenerarResumen(empleadoId, periodo);

  const closeModal = () => setModal(null);
  const handleOpenChange = (open: boolean) => {
    if (!open) closeModal();
  };

  const aprobado = data?.estado === "APROBADO";
  const puedeAprobar =
    data?.estado === "PENDIENTE" &&
    data.vigente &&
    data.completo &&
    data.pendientes === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SelectorMes
          periodo={periodo}
          onChange={setPeriodo}
          periodoMinimo={fechaInicioLabores?.slice(0, 7)}
        />

        <div className="flex flex-wrap items-center gap-2">
          {!aprobado && (
            <AccionButton
              label="Registrar marcación"
              icon={ClockPlusIcon}
              onClick={() => setModal({ tipo: "marcacion" })}
              className="text-sky-600"
            />
          )}
          <AccionButton
            label="Asignar jornada"
            icon={CalendarClockIcon}
            onClick={() => setModal({ tipo: "jornada" })}
            className="text-sky-600"
          />

          {data && !aprobado && (
            <LoadingButton
              variant="outline"
              isLoading={generar.isPending}
              loadingText="Actualizando…"
              icon={RefreshCwIcon}
              onClick={() => generar.mutate()}
            >
              Actualizar resumen
            </LoadingButton>
          )}
          {data?.estado === "PENDIENTE" && (
            <Button
              variant="outline"
              className="text-destructive"
              onClick={() =>
                setModal({ tipo: "resolverResumen", accion: "RECHAZAR" })
              }
            >
              Rechazar
            </Button>
          )}
          {data && data.estado !== "PENDIENTE" && (
            <Button
              variant="outline"
              onClick={() =>
                setModal({ tipo: "resolverResumen", accion: "REABRIR" })
              }
            >
              Reabrir
            </Button>
          )}
          {data?.estado === "PENDIENTE" && (
            <Button
              disabled={!puedeAprobar}
              onClick={() => setModal({ tipo: "aprobar" })}
            >
              <CheckIcon data-icon="inline-start" />
              Aprobar
            </Button>
          )}
        </div>
      </div>

      <ErrorAlert
        error={generar.error}
        title="No se pudo actualizar el resumen"
      />

      <DetalleTabEstado
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!data}
        emptyTitle={`Sin resumen de ${formatPeriodo(periodo)}`}
        emptyDescription="Genera el resumen para ver el detalle de cada día del mes."
      >
        {data && (
          <div className="space-y-4">
            <ResumenMesCards resumen={data} />
            <DetalleDiarioTabla
              dias={data.detalle?.dias ?? []}
              puedeResolver={!aprobado}
              onResolver={(fecha) => setModal({ tipo: "dia", fecha })}
            />
          </div>
        )}
      </DetalleTabEstado>

      {/* Sin resumen no hay detalle: el primer cálculo se pide desde aquí */}
      {!isLoading && !error && !data && (
        <div className="flex justify-center">
          <LoadingButton
            isLoading={generar.isPending}
            loadingText="Generando…"
            onClick={() => generar.mutate()}
          >
            Generar resumen
          </LoadingButton>
        </div>
      )}

      <AprobarResumenModal
        empleadoId={empleadoId}
        periodo={periodo}
        open={modal?.tipo === "aprobar"}
        onOpenChange={handleOpenChange}
      />
      <ResolverResumenModal
        empleadoId={empleadoId}
        periodo={periodo}
        accion={modal?.tipo === "resolverResumen" ? modal.accion : "RECHAZAR"}
        open={modal?.tipo === "resolverResumen"}
        onOpenChange={handleOpenChange}
      />
      <MarcacionManualModal
        empleadoId={empleadoId}
        nroDocumento={nroDocumento}
        periodo={periodo}
        open={modal?.tipo === "marcacion"}
        onOpenChange={handleOpenChange}
      />
      <AsignarJornadaModal
        empleadoId={empleadoId}
        periodo={periodo}
        jornadas={jornadas}
        isLoadingJornadas={isLoadingJornadas}
        fechaInicioLabores={fechaInicioLabores}
        open={modal?.tipo === "jornada"}
        onOpenChange={handleOpenChange}
      />
      <ResolverDiaModal
        empleadoId={empleadoId}
        periodo={periodo}
        fecha={modal?.tipo === "dia" ? modal.fecha : null}
        onClose={closeModal}
      />
    </div>
  );
}
