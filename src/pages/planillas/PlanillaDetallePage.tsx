import { useState } from "react";
import { isAxiosError } from "axios";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { BackLink } from "@/components/page/BackLink";
import { PageHeader } from "@/components/page/PageHeader";
import { ResumenCifra } from "@/components/page/ResumenCifra";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EstadoPlanillaBadge } from "@/features/planillas/components/EstadoPlanillaBadge";
import { PlanillaCabeceraCard } from "@/features/planillas/components/detalle/PlanillaCabeceraCard";
import { PlanillaConceptosCard } from "@/features/planillas/components/detalle/PlanillaConceptosCard";
import { PlanillaValidacionInfo } from "@/features/planillas/components/detalle/PlanillaValidacionInfo";
import { AvanceGeneracion } from "@/features/planillas/components/generacion/AvanceGeneracion";
import { ValidarPlanillaModal } from "@/features/planillas/components/modals/ValidarPlanillaModal";
import {
  CONCEPTOS_APORTE,
  CONCEPTOS_INGRESO,
  getConceptosDescuento,
} from "@/features/planillas/config/planillas.config";
import {
  useGenerarPlanillas,
  useTrabajoPlanillas,
} from "@/features/planillas/hooks/useGenerarPlanillas";
import { usePlanilla } from "@/features/planillas/hooks/usePlanilla";
import { useDescargarBoleta } from "@/features/planillas/hooks/usePlanillaActions";
import {
  esEstadoTrabajoFinal,
  esPlanillaValidable,
  esRegimenOnp,
  getCabeceraPlanilla,
  tieneBoleta,
} from "@/features/planillas/utils/planillas.utils";
import { formatCurrency, toTitleCase } from "@/lib/format.utils";
import { generarUuid } from "@/lib/id.utils";
import { formatPeriodo } from "@/lib/periodo.utils";

/** Nombre del colaborador que el listado envía al abrir el detalle */
const getNombreColaborador = (state: unknown): string | null => {
  if (typeof state !== "object" || state === null) return null;

  const { nombre } = state as { nombre?: unknown };

  return typeof nombre === "string" && nombre.trim() ? nombre : null;
};

/**
 * Detalle de la planilla de un colaborador en un mes
 *
 * @remarks
 * Muestra los datos de cabecera del colaborador, los conceptos completos de
 * ingresos, descuentos según el régimen pensionario y aportes del empleador.
 * Permite recalcular y validar cuando la planilla está abierta, y descargar la
 * boleta cuando ya está validada o declarada.
 */
export default function PlanillaDetallePage() {
  const { id } = useParams();
  const { state } = useLocation();
  const [validarAbierto, setValidarAbierto] = useState(false);
  const [solicitudRecalculo, setSolicitudRecalculo] = useState<string | null>(
    null,
  );
  const [trabajoRecalculo, setTrabajoRecalculo] = useState<string | null>(null);
  const { data: planilla, error, isLoading, refetch } = usePlanilla(id);
  const boleta = useDescargarBoleta();
  const recalcular = useGenerarPlanillas();
  const trabajo = useTrabajoPlanillas(trabajoRecalculo);

  const recalculoTerminado = trabajo.data
    ? esEstadoTrabajoFinal(trabajo.data.estado)
    : isAxiosError(trabajo.error) && trabajo.error.response?.status === 404;
  const recalculando = Boolean(trabajoRecalculo) && !recalculoTerminado;
  const accionEnCurso = recalcular.isPending || recalculando;

  const cabecera = getCabeceraPlanilla(planilla?.snapshot_calculo);
  const nombre =
    getNombreColaborador(state) ??
    (cabecera.nombre_completo ? toTitleCase(cabecera.nombre_completo) : null);

  const volver = planilla
    ? `${ROUTE_PATHS.nomina.planillas}?periodo=${planilla.periodo}`
    : ROUTE_PATHS.nomina.planillas;

  const handleRecalcular = () => {
    if (!planilla) return;

    const solicitudId = solicitudRecalculo ?? generarUuid();
    setSolicitudRecalculo(solicitudId);

    recalcular.mutate(
      {
        periodo: planilla.periodo,
        solicitud_id: solicitudId,
        empleado_id: planilla.empleado_id,
      },
      {
        onSuccess: (respuesta) => {
          setSolicitudRecalculo(null);
          setTrabajoRecalculo(respuesta.trabajo_id);
        },
      },
    );
  };

  return (
    <section
      aria-labelledby="planilla-detalle-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <BackLink to={volver}>Volver a planillas</BackLink>

      {isLoading ? (
        <div className="space-y-6" aria-busy>
          <Skeleton className="h-16 w-full max-w-xl" />
          <Skeleton className="h-36 w-full" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : error ? (
        <ErrorAlert
          error={error}
          title="No se pudo cargar la planilla"
          onRetry={() => refetch()}
        />
      ) : !planilla ? (
        <EmptyState
          title="No encontramos esta planilla"
          description="Puede que ya no exista o que el enlace no sea correcto."
          action={
            <Button variant="outline" render={<Link to={volver} />}>
              Volver a planillas
            </Button>
          }
        />
      ) : (
        <>
          <PageHeader
            id="planilla-detalle-title"
            title={nombre ?? "Planilla del colaborador"}
            description={`Planilla de ${formatPeriodo(planilla.periodo)}`}
            action={
              <div className="flex flex-wrap items-center gap-2">
                <EstadoPlanillaBadge estado={planilla.estado} />

                {esPlanillaValidable(planilla.estado) && (
                  <>
                    <LoadingButton
                      variant="outline"
                      isLoading={accionEnCurso}
                      loadingText={
                        recalcular.isPending ? "Iniciando…" : "Recalculando…"
                      }
                      icon={RefreshCwIcon}
                      title="Vuelve a calcular con los datos actuales de asistencia, sueldo y novedades."
                      onClick={handleRecalcular}
                    >
                      Recalcular esta planilla
                    </LoadingButton>
                    <Button
                      disabled={accionEnCurso}
                      title={
                        accionEnCurso
                          ? "Espera a que termine el recálculo."
                          : undefined
                      }
                      onClick={() => setValidarAbierto(true)}
                    >
                      Validar planilla
                    </Button>
                  </>
                )}

                {tieneBoleta(planilla.estado) && (
                  <LoadingButton
                    variant="outline"
                    isLoading={boleta.isPending}
                    loadingText="Descargando…"
                    icon={DownloadIcon}
                    onClick={() => boleta.mutate(planilla.id)}
                  >
                    Descargar boleta
                  </LoadingButton>
                )}
              </div>
            }
          />

          <ErrorAlert
            error={recalcular.error}
            title="No se pudo iniciar el recálculo"
          />

          {trabajoRecalculo && (
            <AvanceGeneracion
              trabajoId={trabajoRecalculo}
              periodo={planilla.periodo}
              onCerrar={() => setTrabajoRecalculo(null)}
            />
          )}

          <PlanillaCabeceraCard
            planilla={planilla}
            cabecera={cabecera}
            nombre={nombre}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <ResumenCifra
              label="Total ingresos"
              value={formatCurrency(Number(planilla.total_ingresos))}
            />
            <ResumenCifra
              label="Total descuentos"
              value={formatCurrency(Number(planilla.total_descuentos))}
            />
            <ResumenCifra
              label="Neto a pagar"
              value={formatCurrency(Number(planilla.neto_a_pagar))}
              className="text-primary"
            />
          </div>

          <PlanillaValidacionInfo planilla={planilla} />

          <div className="grid gap-6 md:grid-cols-2">
            <PlanillaConceptosCard
              titulo="Ingresos"
              conceptos={CONCEPTOS_INGRESO}
              planilla={planilla}
              total={planilla.total_ingresos}
            />
            <PlanillaConceptosCard
              titulo="Descuentos"
              conceptos={getConceptosDescuento(
                planilla,
                esRegimenOnp(planilla, cabecera),
              )}
              planilla={planilla}
              total={planilla.total_descuentos}
            />
          </div>

          <PlanillaConceptosCard
            titulo="Aportes del empleador"
            descripcion="Los paga la empresa; no se descuentan del sueldo."
            conceptos={CONCEPTOS_APORTE}
            planilla={planilla}
          />

          <ValidarPlanillaModal
            open={validarAbierto}
            onOpenChange={setValidarAbierto}
            planillaId={planilla.id}
            version={planilla.version}
            nombre={nombre ?? "este colaborador"}
            periodo={planilla.periodo}
          />
        </>
      )}
    </section>
  );
}
