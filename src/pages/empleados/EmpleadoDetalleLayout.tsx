import { ArrowLeftIcon } from "lucide-react";
import { Link, Outlet, useParams } from "react-router-dom";

import { ROUTE_PATHS, buildEmpleadoPath } from "@/app/routes/path";
import { PageTabs, type PageTab } from "@/components/page/PageTabs";
import { EmpleadoCargaEstado } from "@/features/empleados/components/detalle/EmpleadoCargaEstado";
import { EmpleadoDetalleHeader } from "@/features/empleados/components/detalle/EmpleadoDetalleHeader";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";

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
 * Las pestañas leen al empleado de la caché de TanStack Query (`useEmpleado`).
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

      <EmpleadoCargaEstado
        isLoading={isLoading}
        error={isError ? error : null}
        onRetry={refetch}
        empleado={empleado}
        titleId="empleado-title"
      >
        {(empleado) => (
          <>
            <EmpleadoDetalleHeader empleado={empleado} />
            <PageTabs label="Secciones de la ficha" tabs={getTabs(empleado.id)} />
            <Outlet />
          </>
        )}
      </EmpleadoCargaEstado>
    </section>
  );
}
