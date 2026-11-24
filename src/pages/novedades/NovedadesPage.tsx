import { Link, useSearchParams } from "react-router-dom";

import { buildPlanillaPath } from "@/app/routes/path";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SelectorMes } from "@/components/filters/SelectorMes";
import { ColaboradorSelect } from "@/components/form/ColaboradorSelect";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { NovedadesMes } from "@/features/novedades/components/NovedadesMes";
import { getNombrePlanilla } from "@/features/planillas/config/planillas.columns";
import { useEmpleadosBusqueda } from "@/features/planillas/hooks/useEmpleadosOpciones";
import { usePlanillas } from "@/features/planillas/hooks/usePlanillas";
import { esPlanillaValidable } from "@/features/planillas/utils/planillas.utils";
import {
  formatPeriodo,
  getPeriodoActual,
  parsePeriodo,
} from "@/lib/periodo.utils";
import { applyParamChanges, parseUuid } from "@/lib/urlParams.utils";

const MOTIVO_NO_EDITABLE =
  "La planilla de este mes ya no está abierta; sus novedades no se pueden cambiar.";

/**
 * Página para registrar y resolver novedades de planilla por colaborador y mes
 *
 * @remarks
 * Consulta las primeras 100 planillas del mes para saber si la del colaborador
 * ya existe y sigue abierta. Si el mes tiene más de 100 planillas o la
 * planilla aún no se calcula, permite operar y el servicio avisará si el mes
 * ya cerró.
 */
export default function NovedadesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { options, isLoading, isFetching, onSearchChange } =
    useEmpleadosBusqueda();

  const periodo = parsePeriodo(searchParams.get("periodo")) ?? getPeriodoActual();
  const empleadoId = parseUuid(searchParams.get("empleado_id"));
  const empleadoNombre = empleadoId
    ? searchParams.get("empleado")?.trim() || undefined
    : undefined;

  const { data: planillasMes, isPlaceholderData: isPlanillasPlaceholder } =
    usePlanillas({
      periodo,
      page: 1,
      limit: 100,
    });

  const planillaColaborador =
    empleadoId && !isPlanillasPlaceholder
      ? planillasMes?.items.find(
          (item) => item.empleado_id === empleadoId && item.periodo === periodo,
        )
      : undefined;

  const handlePeriodoChange = (nextPeriodo: string) => {
    setSearchParams((current) =>
      applyParamChanges(current, {
        periodo: nextPeriodo === getPeriodoActual() ? undefined : nextPeriodo,
      }),
    );
  };

  const handleEmpleadoChange = (value: string | undefined) => {
    if (!value) {
      setSearchParams((current) =>
        applyParamChanges(current, {
          empleado_id: undefined,
          empleado: undefined,
        }),
      );
      return;
    }

    const seleccionado = options.find((option) => option.value === value)?.label;
    setSearchParams((current) =>
      applyParamChanges(current, {
        empleado_id: value,
        empleado: seleccionado || undefined,
      }),
    );
  };

  const nombreColaborador =
    (empleadoId &&
      options.find((option) => option.value === empleadoId)?.label) ||
    empleadoNombre ||
    (planillaColaborador && getNombrePlanilla(planillaColaborador)) ||
    "este colaborador";

  const editable = planillaColaborador
    ? esPlanillaValidable(planillaColaborador.estado)
    : true;

  return (
    <section
      aria-labelledby="novedades-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <PageHeader
        id="novedades-title"
        title="Novedades de planilla"
        description="Registra y resuelve bonos extraordinarios y descuentos de cada colaborador antes de calcular su planilla."
      />

      <div className="flex flex-wrap items-center gap-3">
        <SelectorMes periodo={periodo} onChange={handlePeriodoChange} />
        <div className="w-full sm:w-72">
          <ColaboradorSelect
            ariaLabel="Colaborador"
            placeholder="Elige o busca un colaborador"
            value={empleadoId}
            onChange={handleEmpleadoChange}
            options={options}
            isLoading={isLoading || isFetching}
            onSearchChange={onSearchChange}
            selectedLabel={empleadoNombre}
          />
        </div>
        {planillaColaborador && (
          <Button
            variant="outline"
            render={
              <Link
                to={buildPlanillaPath(planillaColaborador.id)}
                state={{ nombre: getNombrePlanilla(planillaColaborador) }}
              />
            }
          >
            Ver planilla
          </Button>
        )}
      </div>

      {!empleadoId ? (
        <EmptyState
          title="Elige un colaborador"
          description="Las novedades se registran por colaborador y mes. Elige a quién quieres revisar."
        />
      ) : (
        <NovedadesMes
          empleadoId={empleadoId}
          periodo={periodo}
          nombre={nombreColaborador}
          editable={editable}
          motivoNoEditable={editable ? undefined : MOTIVO_NO_EDITABLE}
          titulo={`Novedades de ${formatPeriodo(periodo)}`}
        />
      )}
    </section>
  );
}
