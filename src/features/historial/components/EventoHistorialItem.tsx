import { useState } from "react";
import { ArrowRightIcon, ChevronDownIcon, ClockIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { TIPO_EVENTO_ESTILOS } from "../config/historial.config";
import type { EventoHistorial } from "../types/historial.types";
import { formatDuracion, formatFechaLarga } from "../utils/historial.utils";

interface EventoHistorialItemProps {
  evento: EventoHistorial;
}

/** Valor de antes o de después; un campo que no existía se muestra como guion */
const valorOGuion = (valor: string | null): string => valor ?? "--";

/**
 * Un hecho del historial: su fecha, un círculo con el icono de su clase y una tarjeta con el detalle
 *
 * @remarks
 * Si el evento cambió campos, los muestra como "antes → después". Los campos
 * que no cambiaron quedan plegados bajo "Ver campos sin modificar". La
 * duración solo se muestra si se conoce hasta cuándo rigió el cambio.
 */
export function EventoHistorialItem({ evento }: EventoHistorialItemProps) {
  const [verSinCambios, setVerSinCambios] = useState(false);
  const { icon: Icon, circulo } = TIPO_EVENTO_ESTILOS[evento.tipo];

  return (
    <li className="space-y-2">
      <p className="pl-14 text-sm font-semibold">
        {formatFechaLarga(evento.fecha)}
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
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <h3 className="text-sm font-semibold">{evento.titulo}</h3>
            {evento.vigenteHasta !== undefined && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ClockIcon className="size-3.5" aria-hidden />
                {formatDuracion(evento.fecha, evento.vigenteHasta)}
              </p>
            )}
          </div>

          {evento.descripcion && (
            <p className="text-sm text-muted-foreground">
              {evento.descripcion}
            </p>
          )}

          {evento.cambios && (
            <dl className="space-y-2 text-sm">
              {evento.cambios.map(({ campo, antes, despues }) => (
                <div
                  key={campo}
                  className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] sm:items-start sm:gap-3"
                >
                  <dt className="text-muted-foreground">{campo}</dt>
                  <dd className="text-muted-foreground">
                    {valorOGuion(antes)}
                  </dd>
                  <ArrowRightIcon
                    className="hidden size-4 text-muted-foreground sm:block"
                    aria-hidden
                  />
                  <dd className="font-semibold">{valorOGuion(despues)}</dd>
                </div>
              ))}
            </dl>
          )}

          {evento.sinCambios && (
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                aria-expanded={verSinCambios}
                onClick={() => setVerSinCambios((abierto) => !abierto)}
              >
                {verSinCambios
                  ? "Ocultar campos sin modificar"
                  : "Ver campos sin modificar"}
                <ChevronDownIcon
                  className={cn(
                    "size-4 transition-transform",
                    verSinCambios && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>

              {verSinCambios && (
                <dl className="mt-2 space-y-1 text-sm">
                  {evento.sinCambios.map(({ campo, valor }) => (
                    <div
                      key={campo}
                      className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3"
                    >
                      <dt className="text-muted-foreground">{campo}</dt>
                      <dd>{valor}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Por {evento.actor.nombre} ({evento.actor.rol})
          </p>
        </div>
      </div>
    </li>
  );
}
