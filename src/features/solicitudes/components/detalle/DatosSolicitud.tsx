import { ResumenCampo } from "@/components/form/ResumenCampo";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { formatCurrency, formatDate, orDash } from "@/lib/format.utils";
import {
  getEfectoLabel,
  getOrigenLabel,
  getTipoLabel,
  TIPOS_CON_DIAS,
  TIPOS_CON_FECHAS,
  TIPOS_CON_MONTO,
} from "../../config/solicitudes.config";
import type { SolicitudDetalle } from "../../types/solicitudes.types";
import {
  formatRangoFechas,
  formatRangoHoras,
} from "../../utils/solicitudes.utils";

interface DatosSolicitudProps {
  solicitud: SolicitudDetalle;
}

/**
 * Datos de la solicitud: tipo, periodo o monto, motivo y revisión
 *
 * @remarks
 * Solo muestra lo que aplica al tipo (fechas, horas, días o monto). El efecto
 * en la asistencia aparece cuando la solicitud afecta días de asistencia.
 */
export function DatosSolicitud({ solicitud }: DatosSolicitudProps) {
  const { tipo } = solicitud;
  const horas = formatRangoHoras(solicitud.hora_inicio, solicitud.hora_fin);

  return (
    <section
      aria-labelledby="datos-solicitud-title"
      className="space-y-4 rounded-lg border bg-card p-4"
    >
      <h2 id="datos-solicitud-title" className="text-base font-semibold">
        Datos de la solicitud
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ResumenCampo label="Tipo" value={getTipoLabel(tipo)} />
        {TIPOS_CON_FECHAS.includes(tipo) && (
          <ResumenCampo
            label="Periodo"
            value={formatRangoFechas(
              solicitud.fecha_inicio,
              solicitud.fecha_fin,
            )}
          />
        )}
        {horas && <ResumenCampo label="Horas" value={horas} />}
        {TIPOS_CON_DIAS.includes(tipo) && (
          <ResumenCampo
            label="Días solicitados"
            value={orDash(solicitud.dias_solicitados?.toString())}
          />
        )}
        {TIPOS_CON_MONTO.includes(tipo) && (
          <ResumenCampo
            label="Monto"
            value={formatCurrency(
              solicitud.monto === null ? null : Number(solicitud.monto),
            )}
          />
        )}
        {TIPOS_CON_FECHAS.includes(tipo) && (
          <ResumenCampo
            label="Efecto en la asistencia"
            value={getEfectoLabel(solicitud.efecto_asistencia)}
          />
        )}
        <ResumenCampo
          label="Registrada"
          value={formatFechaHoraLima(solicitud.created_at)}
        />
        <ResumenCampo
          label="Fecha límite"
          value={formatDate(solicitud.fecha_limite)}
        />
        <ResumenCampo label="Origen" value={getOrigenLabel(solicitud.origen)} />
        <ResumenCampo
          label="Responsable"
          value={orDash(solicitud.responsable?.nombre_completo)}
        />
        <ResumenCampo
          label="Motivo"
          value={solicitud.motivo}
          className="col-span-full"
        />
        {solicitud.observacion && (
          <ResumenCampo
            label="Observación"
            value={solicitud.observacion}
            className="col-span-full"
          />
        )}
      </div>
    </section>
  );
}
