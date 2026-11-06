import { TriangleAlertIcon } from "lucide-react";

import { StatusBadge } from "@/components/feedback/StatusBadge";
import {
  TONE_TEXT,
  type StatusTone,
} from "@/components/feedback/statusTone.config";
import { ESTADO_RESUMEN } from "../config/asistencia.config";
import type { ResumenMes } from "../types/asistencia.types";
import { cn } from "@/lib/utils";
import { formatMinutos, getMotivoNoAprobable } from "../utils/asistencia.utils";

interface ResumenMesCardsProps {
  resumen: ResumenMes;
}

interface Dato {
  label: string;
  value: string;
  /** Si el valor es cero: se muestra tenue para que resalte lo que no lo es */
  esCero: boolean;
  /** Color del valor cuando no es cero: faltas en rojo, por resolver en ámbar */
  tono?: StatusTone;
}

/**
 * Totales de un mes: estado del resumen, días, faltas, tardanza, extras y sin goce
 *
 * @remarks
 * Muestra también por qué no se puede aprobar todavía: días por resolver o
 * resumen desactualizado.
 */
export function ResumenMesCards({ resumen }: ResumenMesCardsProps) {
  const datos: Dato[] = [
    {
      label: "Días trabajados",
      value: String(resumen.dias_trabajados),
      esCero: resumen.dias_trabajados === 0,
    },
    {
      label: "Faltas",
      value: String(resumen.faltas),
      esCero: resumen.faltas === 0,
      tono: "danger",
    },
    {
      label: "Tardanza",
      value: formatMinutos(resumen.minutos_tardanza),
      esCero: resumen.minutos_tardanza === 0,
    },
    {
      label: "Salida anticipada",
      value: formatMinutos(resumen.minutos_salida_anticipada),
      esCero: resumen.minutos_salida_anticipada === 0,
    },
    {
      label: "Extras al 25%",
      value: formatMinutos(resumen.minutos_extras_25),
      esCero: resumen.minutos_extras_25 === 0,
    },
    {
      label: "Extras al 35%",
      value: formatMinutos(resumen.minutos_extras_35),
      esCero: resumen.minutos_extras_35 === 0,
    },
    {
      label: "Sin goce",
      value:
        resumen.dias_sin_goce > 0
          ? `${resumen.dias_sin_goce} ${resumen.dias_sin_goce === 1 ? "día" : "días"}`
          : formatMinutos(resumen.minutos_sin_goce),
      esCero: resumen.dias_sin_goce === 0 && resumen.minutos_sin_goce === 0,
    },
    {
      label: "Días por resolver",
      value: String(resumen.pendientes),
      esCero: resumen.pendientes === 0,
      tono: "warning",
    },
  ];

  const aviso = getMotivoNoAprobable(resumen);

  return (
    <section aria-label="Resumen del mes" className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={ESTADO_RESUMEN[resumen.estado].tone}>
          {ESTADO_RESUMEN[resumen.estado].label}
        </StatusBadge>
        {resumen.estado === "RECHAZADO" && resumen.motivo_revision && (
          <p className="text-sm text-muted-foreground">
            Motivo: {resumen.motivo_revision}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-4">
        {datos.map(({ label, value, esCero, tono }) => (
          <div key={label} className="space-y-1 bg-card px-4 py-3">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd
              className={cn(
                "text-xl font-semibold tabular-nums",
                esCero && "font-normal text-muted-foreground",
                !esCero && tono && TONE_TEXT[tono],
              )}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {aviso && (
        <p
          className={cn("flex items-center gap-2 text-sm", TONE_TEXT.warning)}
        >
          <TriangleAlertIcon className="size-4 shrink-0" aria-hidden />
          {aviso}
        </p>
      )}
    </section>
  );
}
