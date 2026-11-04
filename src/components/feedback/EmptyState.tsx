import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Botón u otro elemento bajo el texto, por ejemplo "Generar resumen" */
  action?: ReactNode;
  /** "plain" ocupa la sección; "dashed" es una caja de borde punteado dentro de un modal */
  variant?: "plain" | "dashed";
}

/**
 * Mensaje para cuando no hay nada que mostrar, con una acción opcional
 */
export function EmptyState({
  title,
  description,
  action,
  variant = "plain",
}: EmptyStateProps) {
  const isDashed = variant === "dashed";

  return (
    <div
      className={cn(
        "text-center",
        isDashed
          ? "rounded-lg border border-dashed px-3 py-4"
          : "space-y-1 py-12",
      )}
    >
      <p
        className={cn(
          isDashed ? "text-sm text-muted-foreground" : "font-medium",
        )}
      >
        {title}
      </p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="flex justify-center pt-3">{action}</div>}
    </div>
  );
}
