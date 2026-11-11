import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistorial } from "../hooks/useHistorial";
import { EventoHistorialItem } from "./EventoHistorialItem";

interface HistorialEmpleadoProps {
  empleadoId: string;
}

/** Tabla de auditoría donde se guardan los cambios de un empleado */
const TABLA_EMPLEADOS = "empleados";

/**
 * Pestaña Historial de la ficha: línea de tiempo de los cambios del empleado
 *
 * @remarks
 * Lee la auditoría del backend, del cambio más reciente al más antiguo, de a
 * 20 por vez ("Cargar más").
 */
export function HistorialEmpleado({ empleadoId }: HistorialEmpleadoProps) {
  const {
    data,
    error,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHistorial(TABLA_EMPLEADOS, empleadoId);

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (error && !data)
    return (
      <ErrorAlert
        error={error}
        title="No se pudo cargar el historial"
        onRetry={() => refetch()}
      />
    );

  const eventos = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;

  if (!eventos.length)
    return (
      <EmptyState
        title="Sin cambios registrados"
        description="Todavía no hay nada guardado en el historial de este colaborador."
      />
    );

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {total === 1 ? "1 cambio" : `${total} cambios`}
      </p>

      <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-5 before:w-px before:bg-border">
        {eventos.map((evento) => (
          <EventoHistorialItem key={evento.id} evento={evento} />
        ))}
      </ol>

      {/* Un error al pedir otra página no borra lo ya cargado */}
      {error && (
        <ErrorAlert
          error={error}
          title="No se pudieron cargar más cambios"
        />
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <LoadingButton
            variant="outline"
            isLoading={isFetchingNextPage}
            loadingText="Cargando..."
            onClick={() => fetchNextPage()}
          >
            Cargar más
          </LoadingButton>
        </div>
      )}
    </div>
  );
}
