import { Badge } from "@/components/ui/badge";
import type { EstadoLaboral } from "../../types/empleados.types";

interface EmpleadoEstadoBadgeProps {
  activo: boolean;
  estadoLaboral: EstadoLaboral;
}

type BadgeVariant = "secondary" | "outline" | "destructive";

const ESTADO_LABORAL_BADGE: Record<
  string,
  { label: string; variant: BadgeVariant }
> = {
  ACTIVO: { label: "Activo", variant: "secondary" },
  VACACIONES: { label: "Vacaciones", variant: "outline" },
  LICENCIA: { label: "Licencia", variant: "outline" },
  SUSPENDIDO: { label: "Suspendido", variant: "destructive" },
  CESADO: { label: "Cesado", variant: "destructive" },
  DESPEDIDO: { label: "Despedido", variant: "destructive" },
};

/**
 * Muestra el estado de un empleado en una sola etiqueta
 */
export function EmpleadoEstadoBadge({
  activo,
  estadoLaboral,
}: EmpleadoEstadoBadgeProps) {
  if (!activo) return <Badge variant="destructive">Inactivo</Badge>;

  const badge = ESTADO_LABORAL_BADGE[estadoLaboral] ?? {
    label: estadoLaboral,
    variant: "outline",
  };

  return <Badge variant={badge.variant}>{badge.label}</Badge>;
}
