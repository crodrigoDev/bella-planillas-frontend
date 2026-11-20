import { useState } from "react";
import { ChevronDownIcon, ExternalLinkIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { buildAuditoriaDetallePath } from "@/app/routes/path";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { cn } from "@/lib/utils";
import { getAccionEstilo } from "../../config/historial.config";
import { useAuditoriaRegistro } from "../../hooks/useAuditoria";
import type {
  DetalleLocationState,
  FilaActividad,
} from "../../types/auditoria.types";
import { CambiosActividad } from "../cambios/CambiosActividad";

/** Cuántos campos modificados se nombran en la tarjeta antes de decir "y N más" */
const MAX_CAMPOS = 5;

interface EventoHistorialItemProps {
  evento: FilaActividad;
}

/**
 * Un hecho del historial: su fecha, un círculo con el icono de su acción y una tarjeta con el detalle
 *
 * @remarks
 * El título es el resumen que escribe el backend. Los valores antes y después no
 * vienen en la lista: se piden al abrir "Ver cambios". "Abrir detalle" lleva a la
 * página del registro y recuerda esta pestaña para volver.
 */
export function EventoHistorialItem({ evento }: EventoHistorialItemProps) {
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();
  const { icon: Icon, circulo } = getAccionEstilo(evento.accion_etiqueta);
  const { campos_modificados: campos, actor } = evento;

  return (
    <li className="space-y-2">
      <p className="pl-14 text-sm font-semibold">
        {formatFechaHoraLima(evento.fecha)}
      </p>

      <div className="relative pl-14">
        <span
          aria-hidden
          className={cn(
            "absolute top-0 left-0 flex size-10 items-center justify-center rounded-full ring-4 ring-background",
            circulo,
          )}
        >
          <Icon className="size-5" />
        </span>

        <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
          <div className="space-y-1.5">
            <StatusBadge tone="neutral">{evento.modulo_etiqueta}</StatusBadge>
            <h3 className="text-sm font-semibold">{evento.resumen}</h3>
          </div>

          {campos.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {campos.length > MAX_CAMPOS
                ? `${campos.slice(0, MAX_CAMPOS).join(", ")} y ${campos.length - MAX_CAMPOS} más`
                : campos.join(", ")}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            {actor ? `Por ${actor.nombre} (${actor.rol})` : "Por el sistema"}
          </p>

          <Collapsible open={open} onOpenChange={setOpen}>
            <div className="flex flex-wrap items-center gap-2">
              <CollapsibleTrigger
                render={<Button variant="outline" size="sm" />}
              >
                {open ? "Ocultar cambios" : "Ver cambios"}
                <ChevronDownIcon
                  data-icon="inline-end"
                  className={cn("transition-transform", open && "rotate-180")}
                />
              </CollapsibleTrigger>

              <Button
                variant="ghost"
                size="sm"
                render={
                  <Link
                    to={buildAuditoriaDetallePath(evento.id)}
                    state={
                      {
                        volverA: `${pathname}${search}`,
                      } satisfies DetalleLocationState
                    }
                  />
                }
              >
                Abrir detalle
                <ExternalLinkIcon data-icon="inline-end" />
              </Button>
            </div>

            <CollapsibleContent>
              <div className="pt-3">
                {/* Se monta solo abierto: el detalle se pide al abrir */}
                {open && <CambiosEvento evento={evento} />}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </li>
  );
}

interface CambiosEventoProps {
  evento: FilaActividad;
}

/** Pide el detalle del evento y muestra sus cambios */
function CambiosEvento({ evento }: CambiosEventoProps) {
  const { data, error, isLoading, refetch } = useAuditoriaRegistro(evento.id);

  if (isLoading) return <Skeleton className="h-24 w-full" />;

  if (error)
    return (
      <ErrorAlert
        error={error}
        title="No se pudieron cargar los cambios"
        onRetry={() => refetch()}
      />
    );

  if (!data?.cambios.length)
    return (
      <EmptyState
        variant="dashed"
        title="No hay cambios que mostrar."
        description={
          data === null
            ? "Este registro de auditoría ya no existe."
            : "Esta fila no guardó valores distintos entre antes y después."
        }
      />
    );

  return <CambiosActividad cambios={data.cambios} accion={evento.accion_etiqueta} />;
}
