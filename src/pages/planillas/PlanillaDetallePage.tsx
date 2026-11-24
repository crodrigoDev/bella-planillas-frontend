import { useState } from "react";
import { DownloadIcon } from "lucide-react";
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
import { PlanillaConceptosCard } from "@/features/planillas/components/detalle/PlanillaConceptosCard";
import { PlanillaValidacionInfo } from "@/features/planillas/components/detalle/PlanillaValidacionInfo";
import { ValidarPlanillaModal } from "@/features/planillas/components/modals/ValidarPlanillaModal";
import {
  CONCEPTOS_APORTE,
  CONCEPTOS_DESCUENTO,
  CONCEPTOS_INGRESO,
} from "@/features/planillas/config/planillas.config";
import { useDescargarBoleta } from "@/features/planillas/hooks/usePlanillaActions";
import { usePlanilla } from "@/features/planillas/hooks/usePlanilla";
import {
  esPlanillaValidable,
  tieneBoleta,
} from "@/features/planillas/utils/planillas.utils";
import { formatCurrency } from "@/lib/format.utils";
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
 * El nombre no viene en el detalle: lo envía el listado al navegar. Si se abre
 * el enlace directo se usa un título genérico. Desde aquí se valida la planilla
 * abierta y se descarga la boleta cuando ya está validada o declarada.
 */
export default function PlanillaDetallePage() {
  const { id } = useParams();
  const { state } = useLocation();
  const [validarAbierto, setValidarAbierto] = useState(false);
  const { data: planilla, error, isLoading, refetch } = usePlanilla(id);
  const boleta = useDescargarBoleta();

  const nombre = getNombreColaborador(state);
  const volver = planilla
    ? `${ROUTE_PATHS.nomina.planillas}?periodo=${planilla.periodo}`
    : ROUTE_PATHS.nomina.planillas;

  return (
    <section
      aria-labelledby="planilla-detalle-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <BackLink to={volver}>Volver a planillas</BackLink>

      {isLoading ? (
        <div className="space-y-6" aria-busy>
          <Skeleton className="h-16 w-full max-w-xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24 w-full" />
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
                  <Button onClick={() => setValidarAbierto(true)}>
                    Validar planilla
                  </Button>
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <ResumenCifra
              label="Días laborados"
              value={planilla.dias_laborados}
            />
          </div>

          <PlanillaValidacionInfo planilla={planilla} />

          <div className="grid gap-6 md:grid-cols-2">
            <PlanillaConceptosCard
              titulo="Ingresos"
              conceptos={CONCEPTOS_INGRESO}
              planilla={planilla}
              total={planilla.total_ingresos}
              vacio="Sin ingresos registrados este mes."
            />
            <PlanillaConceptosCard
              titulo="Descuentos"
              conceptos={CONCEPTOS_DESCUENTO}
              planilla={planilla}
              total={planilla.total_descuentos}
              vacio="Sin descuentos este mes."
            />
          </div>

          <PlanillaConceptosCard
            titulo="Aportes del empleador"
            descripcion="Los paga la empresa; no se descuentan del sueldo."
            conceptos={CONCEPTOS_APORTE}
            planilla={planilla}
            vacio="Sin aportes de la empresa este mes."
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
