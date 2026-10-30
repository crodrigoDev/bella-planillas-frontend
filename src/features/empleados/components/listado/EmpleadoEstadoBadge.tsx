import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EstadoLaboral } from "../../types/empleados.types";

interface EmpleadoEstadoBadgeProps {
  activo: boolean;
  estadoLaboral: EstadoLaboral;
}

interface EstadoEstilo {
  label: string;
  /** Fondo, borde y texto de la etiqueta */
  badge: string;
  /** Color del punto */
  dot: string;
}

// Verde = en regla, azul y ámbar = situación temporal, rojo = fuera de la empresa
const VERDE: Omit<EstadoEstilo, "label"> = {
  badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  dot: "bg-emerald-500",
};
const AZUL: Omit<EstadoEstilo, "label"> = {
  badge: "border-sky-200 bg-sky-50 text-sky-700",
  dot: "bg-sky-500",
};
const AMBAR: Omit<EstadoEstilo, "label"> = {
  badge: "border-amber-200 bg-amber-50 text-amber-800",
  dot: "bg-amber-500",
};
const ROJO: Omit<EstadoEstilo, "label"> = {
  badge: "border-red-200 bg-red-50 text-red-700",
  dot: "bg-red-500",
};
const NEUTRO: Omit<EstadoEstilo, "label"> = {
  badge: "border-border bg-muted text-muted-foreground",
  dot: "bg-muted-foreground",
};

const ESTADO_LABORAL_ESTILO: Record<string, EstadoEstilo> = {
  ACTIVO: { label: "Activo", ...VERDE },
  VACACIONES: { label: "Vacaciones", ...AZUL },
  LICENCIA: { label: "Licencia", ...AMBAR },
  SUSPENDIDO: { label: "Suspendido", ...AMBAR },
  CESADO: { label: "Cesado", ...ROJO },
  DESPEDIDO: { label: "Despedido", ...ROJO },
};

/**
 * Muestra el estado de un empleado en una etiqueta con un punto de color
 */
export function EmpleadoEstadoBadge({
  activo,
  estadoLaboral,
}: EmpleadoEstadoBadgeProps) {
  const estilo: EstadoEstilo = !activo
    ? { label: "Inactivo", ...ROJO }
    : (ESTADO_LABORAL_ESTILO[estadoLaboral] ?? {
        label: estadoLaboral,
        ...NEUTRO,
      });

  return (
    <Badge variant="outline" className={cn("h-6 gap-1.5 px-2.5", estilo.badge)}>
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0 rounded-full", estilo.dot)}
      />
      {estilo.label}
    </Badge>
  );
}
