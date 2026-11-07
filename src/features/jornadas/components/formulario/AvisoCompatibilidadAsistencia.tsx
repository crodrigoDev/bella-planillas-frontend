import { TriangleAlertIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { TONE_BADGE } from "@/components/feedback/statusTone.config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { JornadaFormValues } from "../../schemas/jornada.schema";
import { getMotivoNoCompatibleAsistencia } from "../../utils/jornadas.utils";

/**
 * Aviso de tono ámbar con los motivos por los que el motor de asistencia no calcularía esta jornada
 *
 * @remarks
 * No bloquea el guardado: la jornada se puede crear igual, pero no se podrá
 * asignar a un empleado para el cierre mensual hasta que cumpla. No muestra
 * nada si la jornada es compatible.
 */
export function AvisoCompatibilidadAsistencia() {
  const { control } = useFormContext<JornadaFormValues>();
  const turno = useWatch({ control, name: "turno" });
  const horario = useWatch({ control, name: "horario_semanal" });

  const motivos = getMotivoNoCompatibleAsistencia({
    turno,
    horario_semanal: horario,
  });

  if (motivos.length === 0) return null;

  return (
    <Alert className={TONE_BADGE.warning}>
      <TriangleAlertIcon aria-hidden />
      <AlertTitle>No se podrá usar en el cálculo de asistencia</AlertTitle>
      <AlertDescription className="text-warning-soft-foreground">
        <p>
          Puedes guardarla igual, pero el cierre mensual solo acepta jornadas
          fijas diurnas. Para usarla ahí corrige:
        </p>
        <ul className="mt-1 list-disc pl-5">
          {motivos.map((motivo) => (
            <li key={motivo}>{motivo}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
