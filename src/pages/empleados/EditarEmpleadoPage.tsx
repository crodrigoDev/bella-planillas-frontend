import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ROUTE_PATHS, buildEmpleadoPath } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditarEmpleadoForm } from "@/features/empleados/components/edicion/EditarEmpleadoForm";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";
import { getNombreCompleto } from "@/features/empleados/utils/empleados.utils";

/**
 * Edición de los datos de un empleado
 */
export default function EditarEmpleadoPage() {
  const { id } = useParams();
  const {
    data: empleado,
    isLoading,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useEmpleado(id);

  return (
    <section
      aria-labelledby="editar-empleado-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <Link
        to={id ? buildEmpleadoPath(id) : ROUTE_PATHS.gestionPersonal.empleados}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a la ficha
      </Link>

      {/* El dato provisional del listado no trae domicilio ni nombres separados: se espera el detalle */}
      {isLoading || isPlaceholderData ? (
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
          <h1 id="editar-empleado-title" className="text-xl font-semibold">
            No se encontró al empleado
          </h1>
          <p className="text-sm text-muted-foreground">
            Puede que ya no exista o que el enlace no sea correcto.
          </p>
        </div>
      ) : (
        <>
          <PageHeader
            id="editar-empleado-title"
            title="Editar empleado"
            description={`Actualiza los datos de ${getNombreCompleto(empleado)}. Los contratos, derechohabientes y datos financieros se editan desde su ficha.`}
          />
          <EditarEmpleadoForm empleado={empleado} />
        </>
      )}
    </section>
  );
}
