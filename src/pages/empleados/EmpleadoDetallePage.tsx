import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import {
  PageTabs,
  PageTabPanel,
  type PageTab,
} from "@/components/page/PageTabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmpleadoDetalleContratos } from "@/features/empleados/components/detalle/EmpleadoDetalleContratos";
import { EmpleadoDetalleDerechohabientes } from "@/features/empleados/components/detalle/EmpleadoDetalleDerechohabientes";
import { EmpleadoDetalleFinancieros } from "@/features/empleados/components/detalle/EmpleadoDetalleFinancieros";
import { EmpleadoDetalleDatos } from "@/features/empleados/components/detalle/EmpleadoDetalleDatos";
import { EmpleadoDetalleHeader } from "@/features/empleados/components/detalle/EmpleadoDetalleHeader";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";

const TABS: PageTab[] = [
  { value: "resumen", label: "Resumen" },
  { value: "contratos", label: "Contratos" },
  { value: "derechohabientes", label: "Derechohabientes" },
  { value: "financieros", label: "Datos financieros" },
];

const DEFAULT_TAB = "resumen";

/**
 * Ficha de un empleado: su cabecera y sus pestañas
 *
 * @remarks
 * El empleado y la pestaña activa (`?tab=`) viven en la URL, así que la
 * ficha se puede recargar o compartir como enlace.
 */
export default function EmpleadoDetallePage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = TABS.some((item) => item.value === tabParam)
    ? (tabParam as string)
    : DEFAULT_TAB;

  const handleTabChange = (value: string) =>
    setSearchParams(value === DEFAULT_TAB ? {} : { tab: value }, {
      replace: true,
    });

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

          <PageTabs
            label="Secciones de la ficha"
            tabs={TABS}
            value={tab}
            onChange={handleTabChange}
          />

          <PageTabPanel value={tab}>
            {tab === "resumen" && <EmpleadoDetalleDatos empleado={empleado} />}
            {tab === "contratos" && (
              <EmpleadoDetalleContratos empleadoId={empleado.id} />
            )}
            {tab === "derechohabientes" && (
              <EmpleadoDetalleDerechohabientes empleadoId={empleado.id} />
            )}
            {tab === "financieros" && (
              <EmpleadoDetalleFinancieros empleadoId={empleado.id} />
            )}
          </PageTabPanel>
        </>
      )}
    </section>
  );
}
