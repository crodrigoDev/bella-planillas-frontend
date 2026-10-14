import { Link } from "react-router-dom";
import { ArrowRight, ClipboardClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { moduleLabel } from "@/components/modules/module.utils";
import { SOLICITUDES_MOCK } from "@/features/solicitudes/data/solicitudes.mock";
import DashboardPanel from "./DashboardPanel";

const colors = [
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-violet-50 text-violet-700",
  "bg-teal-50 text-teal-700",
];

/** Enlaza cada pendiente al mismo dialogo que permite revisarlo */
export default function DashboardRequests() {
  const items = SOLICITUDES_MOCK.filter(
    (item) => item.estado === "PENDIENTE" || item.estado === "EN_REVISION",
  ).sort((a, b) => a.fecha_solicitud.localeCompare(b.fecha_solicitud));
  return (
    <DashboardPanel
      title={
        <span className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary/5 p-1.5">
            <ClipboardClock aria-hidden className="size-4 text-primary" />
          </span>
          Solicitudes pendientes
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-[9px] text-blue-700"
          >
            {items.length} por revisar
          </Badge>
        </span>
      }
      action={
        <Link
          to="/solicitudes?estado=pendientes"
          className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
        >
          Gestionar todas
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      }
      footer="Priorizado por fecha de registro"
    >
      <div className="divide-y divide-border/40">
        {items.slice(0, 4).map((item, index) => (
          <Link
            key={item.id}
            to={`/solicitudes?solicitud=${item.id}`}
            className="flex items-center gap-3 rounded-md py-3 first:pt-0 hover:bg-muted/30"
          >
            <Avatar className="size-8 shrink-0 after:hidden">
              <AvatarFallback
                className={`rounded-md text-[10px] ${colors[index % colors.length]}`}
              >
                {item.colaborador_resumen.nombre_completo
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-medium">
                  {item.colaborador_resumen.nombre_completo}
                </p>
                <Badge
                  variant="outline"
                  className={`rounded px-1 py-0 text-[8px] ${colors[index % colors.length]}`}
                >
                  {moduleLabel(item.tipo)}
                </Badge>
                <span className="text-[8px] text-muted-foreground">
                  {item.fecha_solicitud.slice(0, 10)}
                </span>
              </div>
              <p className="mt-1 truncate text-[9px] text-muted-foreground">
                {item.tipo === "ADELANTO_SUELDO"
                  ? `S/ ${item.monto?.toFixed(2)} solicitados`
                  : `${item.dias_solicitados ?? "—"} días solicitados`}{" "}
                · {item.colaborador_resumen.area}
              </p>
            </div>
          </Link>
        ))}
        {items.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            No hay solicitudes pendientes
          </p>
        )}
      </div>
    </DashboardPanel>
  );
}
