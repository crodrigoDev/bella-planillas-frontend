import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StepperFooterProps {
  /** Botón para cancelar todo el proceso */
  cancelAction: ReactNode;
  /** Texto de avance, por ejemplo "Paso 1 de 5 completándose" */
  progressLabel: string;
  /** Botones para retroceder o continuar */
  children: ReactNode;
  className?: string;
}

/**
 * Barra inferior de un proceso por pasos
 *
 * @remarks
 * Se queda pegada al borde inferior de la pantalla mientras se llena
 * un formulario largo.
 */
export function StepperFooter({
  cancelAction,
  progressLabel,
  children,
  className,
}: StepperFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-sm",
        className,
      )}
    >
      {cancelAction}

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">{progressLabel}</span>
        {children}
      </div>
    </div>
  );
}
