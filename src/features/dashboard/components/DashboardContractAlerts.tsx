import { Link } from "react-router-dom";
import { FileClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DashboardRrhhResponseDto } from "@jyp/shared-contracts";
import DashboardPanel from "./DashboardPanel";

/** Incluye las alertas que ya forman parte del contrato del dashboard */
export default function DashboardContractAlerts({
  alerts,
}: {
  alerts: DashboardRrhhResponseDto["contratos_alertas"];
}) {
  return (
    <DashboardPanel
      title={
        <span className="flex items-center gap-2">
          <FileClock aria-hidden className="size-4 text-primary" />
          Contratos próximos a vencer
        </span>
      }
      description="Seguimiento de los próximos 30 días"
      action={
        <Badge variant="secondary" className="text-[9px]">
          {alerts.total_por_vencer_30d} contratos
        </Badge>
      }
    >
      <div className="grid gap-3 md:grid-cols-3">
        {alerts.proximos_a_vencer.map((item) => (
          <Link
            key={item.id}
            to={`/empleados/${item.empleado_id}?tab=contratos`}
            className="space-y-2 rounded-lg border p-3 hover:border-primary/30"
          >
            <p className="text-xs font-medium">{item.colaborador}</p>
            <p className="text-[10px] text-muted-foreground">
              {item.area} · {item.cargo}
            </p>
            <Badge
              variant="outline"
              className={
                item.nivel_alerta === "CRITICO"
                  ? "border-red-200 bg-red-50 text-[10px] text-red-600"
                  : "border-amber-200 bg-amber-50 text-[10px] text-amber-700"
              }
            >
              Vence en {item.dias_restantes} días
            </Badge>
          </Link>
        ))}
      </div>
    </DashboardPanel>
  );
}
