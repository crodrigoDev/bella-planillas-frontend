import { Link, useLocation } from "react-router-dom";

import {
  buildAuditoriaDetallePath,
  buildEmpleadoPath,
} from "@/app/routes/path";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { cn } from "@/lib/utils";
import { getAccionEstilo } from "../../config/historial.config";
import { useOtrosCambios } from "../../hooks/useOtrosCambios";
import type { FilaActividad } from "../../types/auditoria.types";
import { buildAuditoriaAfectadoPath } from "../../utils/detalle.utils";

interface OtrosCambiosAfectadoProps {
  fila: FilaActividad;
}

/**
 * Los últimos cambios del mismo afectado, con enlace a cada detalle y a su historial
 *
 * @remarks
 * No se muestra si el cambio no tiene afectado o si es la empresa (no tiene
 * historial propio). Los enlaces conservan el destino de "Volver" de esta
 * página. El historial completo de un colaborador es la pestaña Historial de su
 * ficha; para los demás afectados es el listado de auditoría filtrado.
 */
export function OtrosCambiosAfectado({ fila }: OtrosCambiosAfectadoProps) {
  const { afectado } = fila;
  const { state } = useLocation();
  const { data, error, isLoading, refetch } = useOtrosCambios(
    afectado,
    fila.id,
  );

  if (!afectado || afectado.id === null) return null;

  const verTodo =
    afectado.tipo === "empleado"
      ? {
          to: buildEmpleadoPath(afectado.id, "historial"),
          label: "Ver historial completo",
        }
      : {
          to: buildAuditoriaAfectadoPath(
            afectado.tipo,
            afectado.id,
            afectado.nombre,
          ),
          label: "Ver toda la actividad",
        };

  return (
    <section aria-labelledby="otros-cambios-title" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="otros-cambios-title" className="text-base font-semibold">
          Otros cambios de {afectado.nombre}
        </h2>
        <Link
          to={verTodo.to}
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          {verTodo.label}
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2" aria-busy>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <ErrorAlert
          error={error}
          title="No se pudieron cargar los otros cambios"
          onRetry={() => refetch()}
        />
      ) : data?.length ? (
        <ul className="divide-y border-y">
          {data.map((otra) => {
            const { icon: Icon, circulo } = getAccionEstilo(
              otra.accion_etiqueta,
            );

            return (
              <li key={otra.id}>
                <Link
                  to={buildAuditoriaDetallePath(otra.id)}
                  state={state}
                  className="flex items-center justify-between gap-4 px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full",
                        circulo,
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <span className="sr-only">{otra.accion_etiqueta}: </span>
                    <span className="line-clamp-2 text-sm font-medium sm:line-clamp-1">
                      {otra.resumen}
                    </span>
                  </span>
                  <time
                    dateTime={otra.fecha}
                    className="shrink-0 text-sm text-muted-foreground tabular-nums whitespace-nowrap"
                  >
                    {formatFechaHoraLima(otra.fecha)}
                  </time>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          variant="dashed"
          title="No hay otros cambios registrados."
        />
      )}
    </section>
  );
}
