import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ESTADO_PLANILLA } from "../config/planillas.config";
import type { EstadoPlanilla } from "../types/planillas.types";

interface EstadoPlanillaBadgeProps {
  estado: EstadoPlanilla;
  withDot?: boolean;
  className?: string;
}

/**
 * Insignia que muestra el estado actual de una planilla con su color
 */
export function EstadoPlanillaBadge({
  estado,
  withDot = true,
  className,
}: EstadoPlanillaBadgeProps) {
  const config = ESTADO_PLANILLA[estado];

  return (
    <StatusBadge tone={config.tone} withDot={withDot} className={className}>
      {config.label}
    </StatusBadge>
  );
}
