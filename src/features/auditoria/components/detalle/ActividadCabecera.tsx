import { StatusBadge } from "@/components/feedback/StatusBadge";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { getAccionTone } from "../../config/auditoria.config";
import type { FilaActividad } from "../../types/auditoria.types";

interface ActividadCabeceraProps {
  id: string;
  fila: FilaActividad;
}

/**
 * Cabecera del detalle: el resumen del cambio como título, con su acción, módulo y fecha
 *
 * @remarks
 * El resumen ya viene escrito en lenguaje de negocio por el backend, así que es
 * lo primero que se lee; la acción, el módulo y la hora quedan debajo como datos de apoyo.
 */
export function ActividadCabecera({ id, fila }: ActividadCabeceraProps) {
  return (
    <header className="space-y-3">
      <h1 id={id} className="max-w-3xl text-2xl font-semibold text-balance">
        {fila.resumen}
      </h1>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-foreground">
        <StatusBadge tone={getAccionTone(fila.accion_etiqueta)} withDot>
          {fila.accion_etiqueta}
        </StatusBadge>
        <span aria-hidden>·</span>
        <span>{fila.modulo_etiqueta}</span>
        <span aria-hidden>·</span>
        <time dateTime={fila.fecha}>
          {formatFechaHoraLima(fila.fecha)} (hora de Lima)
        </time>
      </div>
    </header>
  );
}
