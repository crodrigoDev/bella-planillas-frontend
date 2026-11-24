import { CircleCheckIcon, InfoIcon } from "lucide-react";

import { formatDate } from "@/lib/format.utils";
import type { PlanillaDetalle } from "../../types/planillas.types";
import { esPlanillaValidable } from "../../utils/planillas.utils";

interface PlanillaValidacionInfoProps {
  planilla: PlanillaDetalle;
}

/**
 * Aviso de validación de una planilla: cuándo se validó y con qué motivo, o el
 * recordatorio de revisar los montos mientras sigue abierta
 */
export function PlanillaValidacionInfo({
  planilla,
}: PlanillaValidacionInfoProps) {
  if (planilla.validado_en) {
    return (
      <div className="rounded-lg border bg-muted/40 p-4">
        <p className="flex items-center gap-2 text-sm font-medium">
          <CircleCheckIcon
            className="size-4 text-success"
            aria-hidden="true"
          />
          Validada el {formatDate(planilla.validado_en)}
        </p>
        {planilla.comentarios && (
          <p className="mt-1 text-sm text-muted-foreground">
            Motivo: {planilla.comentarios}
          </p>
        )}
      </div>
    );
  }

  if (esPlanillaValidable(planilla.estado)) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        <InfoIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          Revisa los montos. Si algo no cuadra, corrige primero los datos o
          registra una novedad y luego recalcula esta planilla. Al validarla,
          los montos quedan fijos y se habilita la boleta.
        </p>
      </div>
    );
  }

  return null;
}
