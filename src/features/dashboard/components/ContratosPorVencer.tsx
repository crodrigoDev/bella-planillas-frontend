import { ArrowRight, FileClock } from "lucide-react";
import { Link } from "react-router-dom";

import { buildEmpleadoPath, ROUTE_PATHS } from "@/app/routes/path";
import { EmptyState } from "@/components/feedback/EmptyState";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format.utils";
import type { DashboardRrhhResponseDto } from "../types/dashboard.types";
import { formatVencimientoContrato } from "../utils/dashboard.utils";

interface ContratosPorVencerProps {
  alertas: DashboardRrhhResponseDto["contratos_alertas"];
  esMesActual: boolean;
  fechaCorte: string;
}

/**
 * Lista los contratos vigentes próximos a vencer en los siguientes 30 días desde la fecha de corte
 */
export function ContratosPorVencer({
  alertas,
  esMesActual,
  fechaCorte,
}: ContratosPorVencerProps) {
  const { total_por_vencer_30d, criticos_15d, proximos_a_vencer } = alertas;
  const rangoTexto = esMesActual
    ? "en los próximos 30 días"
    : `en los 30 días siguientes al ${formatDate(fechaCorte)}`;

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning-soft text-warning-soft-foreground">
            <FileClock className="size-4" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Contratos por vencer</CardTitle>
            <CardDescription className="text-xs">
              {total_por_vencer_30d}{" "}
              {total_por_vencer_30d === 1 ? "contrato" : "contratos"}{" "}
              {rangoTexto}
              {criticos_15d > 0 && (
                <>
                  {" · "}
                  <span className={TONE_TEXT.danger}>
                    {criticos_15d}{" "}
                    {criticos_15d === 1 ? "crítico" : "críticos"} (≤15 días)
                  </span>
                </>
              )}
            </CardDescription>
          </div>
        </div>

        {esMesActual && (
          <CardAction>
            <Link
              to={`${ROUTE_PATHS.gestionPersonal.contratos}?por_vencer_dias=30`}
              className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Ver todos</span>
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        {proximos_a_vencer.length === 0 ? (
          <EmptyState title={`No hay contratos por vencer ${rangoTexto}`} />
        ) : (
          <div className="divide-y">
            {proximos_a_vencer.map((contrato) => {
              const esCritico = contrato.nivel_alerta === "CRITICO";

              return (
                <Link
                  key={contrato.id}
                  to={buildEmpleadoPath(contrato.empleado_id, "contratos")}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {contrato.colaborador}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {contrato.area} · {contrato.cargo}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge tone={esCritico ? "danger" : "warning"}>
                      {formatVencimientoContrato(contrato.dias_restantes)}
                    </StatusBadge>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      Fin: {formatDate(contrato.fecha_fin)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
