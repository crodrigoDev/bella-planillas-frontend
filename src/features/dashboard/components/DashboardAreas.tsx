import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { DashboardRrhhResponseDto } from "@jyp/shared-contracts";
import DashboardPanel from "./DashboardPanel";

const colors = [
  "bg-primary",
  "bg-indigo-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-purple-400",
];

/** Muestra la participacion de cada area sobre el total del resumen */
export default function DashboardAreas({
  dotacion,
}: {
  dotacion: DashboardRrhhResponseDto["dotacion"];
}) {
  const areas = [...dotacion.distribucion_areas].sort(
    (a, b) => b.total_empleados - a.total_empleados,
  );
  return (
    <DashboardPanel
      title="Distribución por área"
      description={`Participación sobre el total de ${dotacion.total_activos} colaboradores`}
      action={
        <Badge variant="secondary" className="text-[9px]">
          {areas.length} áreas
        </Badge>
      }
      footer={
        <div className="flex justify-between gap-3">
          <span>Total: {dotacion.total_activos} colaboradores activos</span>
          <Link
            to="/areas"
            className="font-medium text-primary hover:underline"
          >
            Gestionar áreas →
          </Link>
        </div>
      }
    >
      <div className="space-y-5 py-1">
        {areas.map((area, index) => (
          <div key={area.area_id} className="space-y-1.5">
            <div className="flex items-start justify-between gap-3 text-[11px]">
              <span>{area.nombre}</span>
              <span className="shrink-0">
                {area.total_empleados}{" "}
                <span className="text-muted-foreground">
                  (
                  {(
                    (area.total_empleados / dotacion.total_activos) *
                    100
                  ).toFixed(1)}{" "}
                  %)
                </span>
              </span>
            </div>
            <div
              role="meter"
              aria-label={area.nombre}
              aria-valuemin={0}
              aria-valuemax={dotacion.total_activos}
              aria-valuenow={area.total_empleados}
              className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-muted"
            >
              <div
                className={`h-full rounded-full ${colors[index % colors.length]}`}
                style={{
                  width: `${(area.total_empleados / dotacion.total_activos) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
