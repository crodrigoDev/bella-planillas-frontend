import { ArrowRightIcon } from "lucide-react";

import { formatFechaHoraLima } from "@/lib/date.utils";
import { formatEtiquetaCambio, formatValorCambio } from "@/lib/format.utils";
import { cn } from "@/lib/utils";
import { getAccionEstilo } from "../config/historial.config";
import type { EventoHistorial } from "../types/historial.types";

interface EventoHistorialItemProps {
  evento: EventoHistorial;
}

/**
 * Un hecho del historial: su fecha, un círculo con el icono de su acción y una tarjeta con el detalle
 *
 * @remarks
 * Cada campo que cambió se muestra como "antes → después", con la etiqueta que
 * calcula el backend. Los campos protegidos (cuentas, CCI, CUSPP) no muestran
 * su valor.
 */
export function EventoHistorialItem({ evento }: EventoHistorialItemProps) {
  const { titulo, icon: Icon, circulo } = getAccionEstilo(evento.accion);

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
          <h3 className="text-sm font-semibold">{titulo}</h3>

          {evento.cambios.length ? (
            <dl className="space-y-2 text-sm">
              {evento.cambios.map(
                ({ campo, etiqueta, antes, despues, protegido }) => (
                  <div
                    key={campo}
                    className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] sm:items-start sm:gap-3"
                  >
                    <dt className="text-muted-foreground">
                      {formatEtiquetaCambio(campo, etiqueta)}
                    </dt>
                    <dd className="wrap-break-word text-muted-foreground">
                      {formatValorCambio(antes, protegido)}
                    </dd>
                    <ArrowRightIcon
                      className="hidden size-4 text-muted-foreground sm:block"
                      aria-hidden
                    />
                    <dd className="wrap-break-word font-semibold">
                      {formatValorCambio(despues, protegido)}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay campos que mostrar en este cambio.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            {evento.usuario
              ? `Por ${evento.usuario.nombre} (${evento.usuario.rol})`
              : "Por el sistema"}
          </p>
        </div>
      </div>
    </li>
  );
}
