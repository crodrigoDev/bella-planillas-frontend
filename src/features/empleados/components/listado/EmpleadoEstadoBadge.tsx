import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ESTADO_LABORAL } from "../../config/empleados.config";
import type { EstadoLaboral } from "../../types/empleados.types";

interface EmpleadoEstadoBadgeProps {
  activo: boolean;
  estadoLaboral: EstadoLaboral;
}

/**
 * Muestra el estado de un empleado en una etiqueta con un punto de color
 */
export function EmpleadoEstadoBadge({
  activo,
  estadoLaboral,
}: EmpleadoEstadoBadgeProps) {
  const estado = !activo
    ? { label: "Inactivo", tone: "danger" as const }
    : (ESTADO_LABORAL[estadoLaboral] ?? {
        label: estadoLaboral,
        tone: "neutral" as const,
      });

  return (
    <StatusBadge tone={estado.tone} withDot>
      {estado.label}
    </StatusBadge>
  );
}
