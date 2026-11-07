import { TriangleAlertIcon } from "lucide-react";

import type { AlertaUrgencia } from "../../types/solicitudes.types";

interface AlertaUrgenciaSolicitudProps {
  alerta: AlertaUrgencia;
}

/**
 * Aviso en tono ámbar de una solicitud abierta cuyo periodo ya empezó o cuyo plazo venció
 */
export function AlertaUrgenciaSolicitud({
  alerta,
}: AlertaUrgenciaSolicitudProps) {
  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-lg border border-warning-border bg-warning-soft p-3 text-sm text-warning-soft-foreground"
    >
      <TriangleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="font-medium">{alerta.mensaje}</p>
        <p>{alerta.detalle}</p>
      </div>
    </div>
  );
}
