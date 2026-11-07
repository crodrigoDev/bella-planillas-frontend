import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { TONE_DOT } from "@/components/feedback/statusTone.config";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  getAccionHistorialLabel,
  getAccionHistorialTone,
} from "../../config/solicitudes.config";
import { useSolicitudHistorial } from "../../hooks/useSolicitudes";
import type { EventoSolicitud } from "../../types/solicitudes.types";
import { formatFechaHoraLima } from "../../utils/solicitudes.utils";

/** Eventos cuyo texto (`observacion.nuevo`) es el motivo de la decisión */
const ACCIONES_CON_OBSERVACION: EventoSolicitud["accion"][] = [
  "APROBADA",
  "RECHAZADA",
  "ANULADA",
];

interface HistorialSolicitudProps {
  /** Id de la solicitud */
  solicitudId: string;
}

/**
 * Línea de tiempo con lo que pasó en una solicitud, del evento más antiguo al más reciente
 *
 * @remarks
 * Es propia de solicitudes: el historial de empleados trabaja con otros
 * tipos de evento. Muestra la observación solo en aprobar, rechazar y anular.
 */
export function HistorialSolicitud({ solicitudId }: HistorialSolicitudProps) {
  const { data, isLoading, error, refetch } =
    useSolicitudHistorial(solicitudId);

  return (
    <section
      aria-labelledby="historial-solicitud-title"
      className="space-y-4 rounded-lg border bg-card p-4"
    >
      <h2 id="historial-solicitud-title" className="text-base font-semibold">
        Historial
      </h2>

      <ErrorAlert
        error={error}
        title="No se pudo cargar el historial"
        onRetry={() => refetch()}
      />

      {isLoading && (
        <div className="space-y-3" aria-busy>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Todavía no hay eventos registrados.
        </p>
      )}

      {data && data.length > 0 && (
        <ol className="space-y-4">
          {data.map((evento, index) => {
            const observacion = ACCIONES_CON_OBSERVACION.includes(evento.accion)
              ? evento.cambios.observacion.nuevo
              : null;

            return (
              <li key={evento.id} className="relative flex gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    TONE_DOT[getAccionHistorialTone(evento.accion)],
                  )}
                />
                {index < data.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-4 -bottom-4 left-[3px] w-px bg-border"
                  />
                )}

                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium">
                    {getAccionHistorialLabel(evento.accion)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {evento.actor.nombre_completo} ·{" "}
                    {formatFechaHoraLima(evento.fecha)}
                  </p>
                  {observacion && (
                    <p className="text-sm wrap-break-word">{observacion}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
