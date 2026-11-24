import { SelectorMes } from "@/components/filters/SelectorMes";

interface PlanillasToolbarProps {
  periodo: string;
  total?: number;
  onPeriodoChange: (periodo: string) => void;
}

/**
 * Barra superior del listado de planillas con selector de mes y total del período
 */
export function PlanillasToolbar({
  periodo,
  total,
  onPeriodoChange,
}: PlanillasToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <SelectorMes periodo={periodo} onChange={onPeriodoChange} />
      {total !== undefined && (
        <span className="text-sm text-muted-foreground">
          {total === 1 ? "1 planilla" : `${total} planillas`}
        </span>
      )}
    </div>
  );
}
