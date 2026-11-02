import type { ReactNode } from "react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Empleado } from "../../types/empleados.types";

interface EmpleadoCargaEstadoProps {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  /** Es null si el empleado no existe */
  empleado: Empleado | null | undefined;
  /** Id del título de la página cuando no se encuentra al empleado */
  titleId: string;
  children: (empleado: Empleado) => ReactNode;
}

/**
 * Resuelve lo que se ve al cargar un empleado: carga, error, no encontrado o su contenido
 *
 * @remarks
 * Lo usan la ficha y la edición, que cargan al empleado de la misma forma.
 */
export function EmpleadoCargaEstado({
  isLoading,
  error,
  onRetry,
  empleado,
  titleId,
  children,
}: EmpleadoCargaEstadoProps) {
  if (isLoading)
    return (
      <div className="space-y-6" aria-busy>
        <Skeleton className="h-14 w-80" />
        <Skeleton className="h-64 w-full" />
      </div>
    );

  if (error)
    return (
      <ErrorAlert
        error={error}
        title="No se pudo cargar al empleado"
        action={
          <Button variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    );

  if (!empleado)
    return (
      <div className="space-y-1 py-12 text-center">
        <h1 id={titleId} className="text-xl font-semibold">
          No se encontró al empleado
        </h1>
        <p className="text-sm text-muted-foreground">
          Puede que ya no exista o que el enlace no sea correcto.
        </p>
      </div>
    );

  return <>{children(empleado)}</>;
}
