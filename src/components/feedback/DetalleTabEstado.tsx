import type { ReactNode } from "react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DetalleTabEstadoProps {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  /** Si no hay nada que mostrar, se ve el estado vacío en lugar de los hijos */
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
}

/**
 * Resuelve lo que se ve en una pestaña de la ficha: carga, error, vacío o los datos
 */
export function DetalleTabEstado({
  isLoading,
  error,
  onRetry,
  isEmpty,
  emptyTitle,
  emptyDescription,
  children,
}: DetalleTabEstadoProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        error={error}
        title="No se pudo cargar la información"
        action={
          <Button variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  if (isEmpty) {
    return (
      <div className="space-y-1 py-12 text-center">
        <p className="font-medium">{emptyTitle}</p>
        <p className="text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return <>{children}</>;
}
