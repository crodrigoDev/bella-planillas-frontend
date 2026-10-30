import { ArrowLeftIcon } from "lucide-react";
import { Link, Outlet, useParams } from "react-router-dom";

import { ROUTE_PATHS, buildEmpleadoPath } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageTabs, type PageTab } from "@/components/page/PageTabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmpleadoDetalleHeader } from "@/features/empleados/components/detalle/EmpleadoDetalleHeader";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";
import type { EmpleadoDetalleContext } from "@/features/empleados/hooks/useEmpleadoDetalleContext";

const getTabs = (id: string): PageTab[] => [
  { to: buildEmpleadoPath(id), label: "Información", end: true },
  { to: buildEmpleadoPath(id, "contratos"), label: "Contratos" },
  { to: buildEmpleadoPath(id, "derechohabientes"), label: "Derechohabientes" },
  { to: buildEmpleadoPath(id, "asistencia"), label: "Asistencia" },
  { to: buildEmpleadoPath(id, "historial"), label: "Historial" },
];

/**
 * Ficha de un empleado: su cabecera, sus pestañas y la pestaña abierta
 *
 * @remarks
 * Cada pestaña es una ruta hija (`/empleados/:id/contratos`). Este layout
 * carga al empleado una sola vez y se queda montado al cambiar de pestaña.
 */
export default function EmpleadoDetalleLayout() {
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
      ) : !empleado || !id ? (
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
          <PageTabs label="Secciones de la ficha" tabs={getTabs(id)} />
          <Outlet context={{ empleado } satisfies EmpleadoDetalleContext} />
        </>
      )}
    </section>
  );
}
