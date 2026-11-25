import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ESTADO_EXPORTACION_LABELS } from "../config/exportaciones.config";
import type { EstadoExportacion } from "../types/exportaciones.types";

interface EstadoExportacionBadgeProps {
  estado: EstadoExportacion;
  withDot?: boolean;
  className?: string;
}

/**
 * Insignia que muestra el estado actual de una exportación con su color
 */
export function EstadoExportacionBadge({
  estado,
  withDot = true,
  className,
}: EstadoExportacionBadgeProps) {
  const config = ESTADO_EXPORTACION_LABELS[estado];

  return (
    <StatusBadge tone={config.tone} withDot={withDot} className={className}>
      {config.label}
    </StatusBadge>
  );
}
