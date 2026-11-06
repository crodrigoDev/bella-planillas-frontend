import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TONE_BADGE,
  TONE_DOT,
  type StatusTone,
} from "./statusTone.config";

interface StatusBadgeProps {
  tone: StatusTone;
  children: ReactNode;
  /** Muestra un punto de color antes del texto */
  withDot?: boolean;
  className?: string;
}

/**
 * Insignia de estado con el color de su tono
 *
 * @remarks
 * Los colores salen de `statusTone.config.ts`, que usa los tokens del tema:
 * cambiar el estilo de todas las insignias es editar ese archivo.
 */
export function StatusBadge({
  tone,
  children,
  withDot,
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(TONE_BADGE[tone], withDot && "h-6 gap-1.5 px-2.5", className)}
    >
      {withDot && (
        <span
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[tone])}
        />
      )}
      {children}
    </Badge>
  );
}
