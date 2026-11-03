import { TriangleAlertIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  ESTADO_RESUMEN_LABELS,
  ESTADO_RESUMEN_STYLES,
} from "../config/asistencia.config";
import type { ResumenMes } from "../types/asistencia.types";
import { formatMinutos } from "../utils/asistencia.utils";

interface ResumenMesCardsProps {
  resumen: ResumenMes;
}

interface Dato {
  label: string;
  value: string;
}

/**
 * Totales de un mes: estado del resumen, días trabajados, faltas, tardanza y extras
 *
 * @remarks
 * Muestra también por qué no se puede aprobar todavía: días por resolver o
 * resumen desactualizado.
 */
export function ResumenMesCards({ resumen }: ResumenMesCardsProps) {
  const datos: Dato[] = [
    { label: "Días trabajados", value: String(resumen.dias_trabajados) },
    { label: "Faltas", value: String(resumen.faltas) },
    { label: "Tardanza", value: formatMinutos(resumen.minutos_tardanza) },
    {
      label: "Extras al 25%",
      value: formatMinutos(resumen.minutos_extras_25),
    },
    {
      label: "Extras al 35%",
      value: formatMinutos(resumen.minutos_extras_35),
    },
    { label: "Días por resolver", value: String(resumen.pendientes) },
  ];

  const avisos = [
    resumen.pendientes > 0 &&
      `Hay ${resumen.pendientes} ${resumen.pendientes === 1 ? "día" : "días"} por resolver antes de aprobar.`,
    !resumen.vigente &&
      "El resumen está desactualizado: actualízalo para poder aprobarlo.",
  ].filter(Boolean);

  return (
    <section aria-label="Resumen del mes" className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={ESTADO_RESUMEN_STYLES[resumen.estado]}
        >
          {ESTADO_RESUMEN_LABELS[resumen.estado]}
        </Badge>
        {resumen.estado === "RECHAZADO" && resumen.motivo_revision && (
          <p className="text-sm text-muted-foreground">
            Motivo: {resumen.motivo_revision}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {datos.map(({ label, value }) => (
          <div key={label} className="space-y-1 bg-card px-4 py-3">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      {avisos.map((aviso) => (
        <p
          key={String(aviso)}
          className="flex items-center gap-2 text-sm text-amber-700"
        >
          <TriangleAlertIcon className="size-4 shrink-0" aria-hidden />
          {aviso}
        </p>
      ))}
    </section>
  );
}
