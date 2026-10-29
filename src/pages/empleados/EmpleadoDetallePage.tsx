import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmpleadoDetalleDatos } from "@/features/empleados/components/detalle/EmpleadoDetalleDatos";
import { EmpleadoDetalleHeader } from "@/features/empleados/components/detalle/EmpleadoDetalleHeader";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";

/**
 * Ficha de un empleado: su cabecera y sus datos
 *
 * @remarks
 * El empleado se carga por el id de la URL, así que la ficha se puede
 * recargar o compartir como enlace.
 */
export default function EmpleadoDetallePage() {
  const { id } = useParams();
  const { data: empleado, isLoading, isError, error, refetch } = useEmpleado(id);

  return (
    <section
      aria-labelledby="empleado-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <Link
        to={ROUTE_PATHS.gestionPersonal.empleados}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a Empleados
      </Link>

      {isLoading ? (
        <div className="space-y-6" aria-busy>
          <Skeleton className="h-14 w-80" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError ? (
        <ErrorAlert
          error={error}
          title="No se pudo cargar al empleado"
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          }
        />
      ) : !empleado ? (
        <div className="space-y-1 py-12 text-center">
          <h1 id="empleado-title" className="text-xl font-semibold">
            No se encontró al empleado
          </h1>
          <p className="text-sm text-muted-foreground">
            Puede que ya no exista o que el enlace no sea correcto.
          </p>
        </div>
      ) : (
        <>
          <EmpleadoDetalleHeader empleado={empleado} />
          <EmpleadoDetalleDatos empleado={empleado} />
        </>
      )}
    </section>
  );
}
