import { useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckIcon, ChevronDownIcon, RefreshCwIcon } from "lucide-react";

import { DetalleTabEstado } from "@/components/feedback/DetalleTabEstado";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SelectOption } from "@/lib/types/options.types";
import { useGenerarResumen } from "../hooks/useAsistenciaActions";
import { useResumenMes } from "../hooks/useAsistencia";
import {
  esDiaSinJornada,
  formatPeriodo,
  getPeriodoActual,
  parsePeriodo,
} from "../utils/asistencia.utils";
import { AvisoJornada } from "./AvisoJornada";
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
  | { tipo: "resolverResumen" }
  | { tipo: "marcacion" }
  | { tipo: "jornada" }
  | { tipo: "dia"; fecha: string };

interface BotonResumenProps {
  /** Motivo por el que la acción no se puede hacer; null si se puede */
  motivo: string | null;
  onClick: () => void;
  variant?: "default" | "outline";
  className?: string;
  children: ReactNode;
}

/**
 * Botón de una acción del resumen, deshabilitado con su motivo en un tooltip
 *
 * @remarks
 * El span deja que el tooltip funcione aunque el botón esté deshabilitado.
 */
function BotonResumen({
  motivo,
  onClick,
  variant = "outline",
  className,
  children,
}: BotonResumenProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span />}>
        <Button
          disabled={motivo !== null}
          onClick={onClick}
          variant={variant}
          className={className}
        >
          {children}
        </Button>
      </TooltipTrigger>
      {motivo && <TooltipContent>{motivo}</TooltipContent>}
    </Tooltip>
  );
}

interface AsistenciaEmpleadoProps {
  empleadoId: string;
  /** Documento del empleado: el backend identifica las marcaciones manuales por él */
  nroDocumento: string;
  /** Inicio de labores del empleado: la jornada no puede empezar antes */
  fechaInicioLabores: string | null;
  /** Jornada vigente del empleado, para el subtítulo del detalle */
  jornadaActual: string;
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
  jornadaActual,
  jornadas,
  isLoadingJornadas,
}: AsistenciaEmpleadoProps) {
  const [searchParams] = useSearchParams();
  // El cierre mensual enlaza aquí con `?periodo=YYYY-MM`; si no es válido, el mes actual
  const [periodo, setPeriodo] = useState(
    () => parsePeriodo(searchParams.get("periodo")) ?? getPeriodoActual(),
  );
  const [modal, setModal] = useState<ModalAbierto | null>(null);
  // Última acción de rechazar o reabrir: no se limpia al cerrar para que el
  // diálogo no cambie de texto mientras se anima la salida.
  const [accionResumen, setAccionResumen] =
    useState<AccionResumen>("RECHAZAR");

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
  // El backend dice qué acciones se pueden hacer y, si no, por qué
  const acciones = data?.acciones;
  // Días que el backend no evalúa porque falta la jornada
  const fechasSinJornada = (data?.detalle?.dias ?? [])
    .filter(esDiaSinJornada)
    .map((dia) => dia.fecha);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SelectorMes
          periodo={periodo}
          onChange={setPeriodo}
          periodoMinimo={fechaInicioLabores?.slice(0, 7)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Registrar
              <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!aprobado && (
                <DropdownMenuItem
                  onClick={() => setModal({ tipo: "marcacion" })}
                >
                  Marcación manual
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setModal({ tipo: "jornada" })}>
                Asignar jornada
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
            <BotonResumen
              motivo={acciones?.rechazar ?? null}
              className={
                acciones?.rechazar === null ? "text-destructive" : undefined
              }
              onClick={() => {
                setAccionResumen("RECHAZAR");
                setModal({ tipo: "resolverResumen" });
              }}
            >
              Rechazar
            </BotonResumen>
          )}
          {data && data.estado !== "PENDIENTE" && (
            <BotonResumen
              motivo={acciones?.reabrir ?? null}
              onClick={() => {
                setAccionResumen("REABRIR");
                setModal({ tipo: "resolverResumen" });
              }}
            >
              Reabrir
            </BotonResumen>
          )}
          {data?.estado === "PENDIENTE" && (
            <BotonResumen
              motivo={acciones?.aprobar ?? null}
              variant="default"
              onClick={() => setModal({ tipo: "aprobar" })}
            >
              <CheckIcon data-icon="inline-start" />
              Aprobar
            </BotonResumen>
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
        // Sin resumen no hay detalle: el primer cálculo se pide desde aquí
        emptyAction={
          <LoadingButton
            isLoading={generar.isPending}
            loadingText="Generando…"
            onClick={() => generar.mutate()}
          >
            Generar resumen
          </LoadingButton>
        }
      >
        {data && (
          <div className="space-y-4">
            {fechasSinJornada.length > 0 && (
              <AvisoJornada
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModal({ tipo: "jornada" })}
                  >
                    Asignar jornada
                  </Button>
                }
              >
                Falta asignar una jornada desde la fecha de ingreso del
                empleado. Hasta entonces, los días sin jornada no se calculan ni
                se pueden resolver. Las marcaciones que se registren se guardan
                y se usarán cuando exista la jornada.
              </AvisoJornada>
            )}
            <ResumenMesCards resumen={data} />
            <DetalleDiarioTabla
              dias={data.detalle?.dias ?? []}
              jornada={jornadaActual}
              puedeResolver={!aprobado}
              onResolver={(fecha) => setModal({ tipo: "dia", fecha })}
            />
          </div>
        )}
      </DetalleTabEstado>

      <AprobarResumenModal
        empleadoId={empleadoId}
        periodo={periodo}
        open={modal?.tipo === "aprobar"}
        onOpenChange={handleOpenChange}
      />
      <ResolverResumenModal
        empleadoId={empleadoId}
        periodo={periodo}
        accion={accionResumen}
        open={modal?.tipo === "resolverResumen"}
        onOpenChange={handleOpenChange}
      />
      <MarcacionManualModal
        empleadoId={empleadoId}
        nroDocumento={nroDocumento}
        periodo={periodo}
        fechasSinJornada={fechasSinJornada}
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
