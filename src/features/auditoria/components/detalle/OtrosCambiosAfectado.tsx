import { Link, useLocation } from "react-router-dom";

import {
  buildAuditoriaDetallePath,
  buildEmpleadoPath,
} from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { getAccionTone } from "../../config/auditoria.config";
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
    <section
      aria-labelledby="otros-cambios-title"
      className="space-y-3 rounded-lg border bg-card p-4"
    >
      <h2 id="otros-cambios-title" className="text-base font-semibold">
        Otros cambios de {afectado.nombre}
      </h2>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : error ? (
        <ErrorAlert
          error={error}
          title="No se pudieron cargar los otros cambios"
          onRetry={() => refetch()}
        />
      ) : data?.length ? (
        <ul className="-mx-2 divide-y">
          {data.map((otra) => (
            <li key={otra.id}>
              <Link
                to={buildAuditoriaDetallePath(otra.id)}
                state={state}
                className="block space-y-1 rounded-md px-2 py-2.5 hover:bg-muted/60"
              >
                <span className="line-clamp-2 text-sm font-medium">
                  {otra.resumen}
                </span>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <StatusBadge tone={getAccionTone(otra.accion_etiqueta)}>
                    {otra.accion_etiqueta}
                  </StatusBadge>
                  {formatFechaHoraLima(otra.fecha)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No hay otros cambios registrados.
        </p>
      )}

      <Link
        to={verTodo.to}
        className="inline-block text-sm font-medium text-primary hover:underline"
      >
        {verTodo.label}
      </Link>
    </section>
  );
}
