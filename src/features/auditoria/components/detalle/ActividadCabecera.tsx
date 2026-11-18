import { StatusBadge } from "@/components/feedback/StatusBadge";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { getAccionTone } from "../../config/auditoria.config";
import type { FilaActividad } from "../../types/auditoria.types";

interface ActividadCabeceraProps {
  id: string;
  fila: FilaActividad;
}

/**
 * Cabecera del detalle: el resumen del cambio como título, con su acción y su fecha
 *
 * @remarks
 * El resumen ya viene escrito en lenguaje de negocio por el backend, así que es
 * lo primero que se lee; la acción y la hora quedan debajo como datos de apoyo.
 */
export function ActividadCabecera({ id, fila }: ActividadCabeceraProps) {
  return (
    <header className="space-y-3">
      <h1 id={id} className="max-w-3xl text-2xl font-semibold text-balance">
        {fila.resumen}
      </h1>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <StatusBadge tone={getAccionTone(fila.accion_etiqueta)} withDot>
          {fila.accion_etiqueta}
        </StatusBadge>
        <time dateTime={fila.fecha} className="text-sm text-muted-foreground">
          {formatFechaHoraLima(fila.fecha)} (hora de Lima)
        </time>
      </div>
    </header>
  );
}
