import type { ReactNode } from "react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Skeleton } from "@/components/ui/skeleton";

interface DetalleTabEstadoProps {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  /** Si no hay nada que mostrar, se ve el estado vacío en lugar de los hijos */
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  /** Botón bajo el mensaje vacío, por ejemplo para crear lo que falta */
  emptyAction?: ReactNode;
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
  emptyAction,
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
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return <>{children}</>;
}
