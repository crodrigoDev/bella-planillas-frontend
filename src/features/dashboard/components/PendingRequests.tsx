import { ArrowRight, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

import { buildSolicitudPath, ROUTE_PATHS } from "@/app/routes/path";
import { EmptyState } from "@/components/feedback/EmptyState";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getEstadoLabel,
  getEstadoTone,
  getTipoLabel,
} from "@/features/solicitudes/config/solicitudes.config";
import type { DashboardRrhhResponseDto } from "../types/dashboard.types";
import { formatDetalleSolicitud } from "../utils/dashboard.utils";

interface PendingRequestsProps {
  solicitudes: DashboardRrhhResponseDto["solicitudes_tramite"];
}

/**
 * Lista las solicitudes pendientes o en revisión próximas a atender
 */
export function PendingRequests({ solicitudes }: PendingRequestsProps) {
  const { total_pendientes, proximas } = solicitudes;

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-info-soft text-info-soft-foreground">
            <Inbox className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Solicitudes en trámite</CardTitle>
            <Badge variant="secondary">{total_pendientes} en trámite</Badge>
          </div>
        </div>

        <CardAction>
          <Link
            to={ROUTE_PATHS.gestionPersonal.solicitudes}
            className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Ver todas</span>
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1">
        {proximas.length === 0 ? (
          <EmptyState title="No hay solicitudes pendientes" />
        ) : (
          <div className="divide-y">
            {proximas.map((solicitud) => (
              <Link
                key={solicitud.id}
                to={buildSolicitudPath(solicitud.codigo)}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="truncate text-sm font-medium">
                      {solicitud.colaborador}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      · {getTipoLabel(solicitud.tipo)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {solicitud.area} · {formatDetalleSolicitud(solicitud)}
                  </p>
                </div>

                <StatusBadge
                  tone={getEstadoTone(solicitud.estado)}
                  withDot
                  className="shrink-0"
                >
                  {getEstadoLabel(solicitud.estado)}
                </StatusBadge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
