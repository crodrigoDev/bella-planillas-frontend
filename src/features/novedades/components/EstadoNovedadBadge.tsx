import { StatusBadge } from "@/components/feedback/StatusBadge";
import {
  ESTADO_NOVEDAD_LABELS,
  ESTADO_NOVEDAD_TONE,
} from "../config/novedades.config";
import type { EstadoNovedad } from "../types/novedades.types";

interface EstadoNovedadBadgeProps {
  estado: EstadoNovedad;
  withDot?: boolean;
  className?: string;
}

/**
 * Insignia que muestra el estado actual de una novedad de planilla
 */
export function EstadoNovedadBadge({
  estado,
  withDot = true,
  className,
}: EstadoNovedadBadgeProps) {
  return (
    <StatusBadge
      tone={ESTADO_NOVEDAD_TONE[estado]}
      withDot={withDot}
      className={className}
    >
      {ESTADO_NOVEDAD_LABELS[estado]}
    </StatusBadge>
  );
}
