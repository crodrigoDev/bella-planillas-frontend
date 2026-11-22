import { Building2 } from "lucide-react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardRrhhResponseDto } from "../types/dashboard.types";
import { formatPorcentaje } from "../utils/dashboard.utils";

interface AreaDistributionProps {
  areas: DashboardRrhhResponseDto["dotacion"]["distribucion_areas"];
  totalActivos: number;
}

const AREA_BAR_CLASSES = [
  "bg-category-1",
  "bg-category-2",
  "bg-category-3",
  "bg-category-4",
  "bg-category-5",
  "bg-chart-2",
  "bg-chart-4",
] as const;

/**
 * Distribución de colaboradores activos por área en barras horizontales
 */
export function AreaDistribution({
  areas,
  totalActivos,
}: AreaDistributionProps) {
  const sinActivos = totalActivos === 0 || areas.length === 0;

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-4" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Distribución por área</CardTitle>
            <CardDescription className="text-xs">
              Sobre {totalActivos}{" "}
              {totalActivos === 1
                ? "colaborador activo"
                : "colaboradores activos"}
            </CardDescription>
          </div>
        </div>

        {!sinActivos && (
          <CardAction>
            <Badge variant="secondary">
              {areas.length} {areas.length === 1 ? "área" : "áreas"}
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        {sinActivos ? (
          <EmptyState title="No hay colaboradores activos en este periodo" />
        ) : (
          <div className="space-y-4">
            {areas.map((area, index) => {
              const barColor =
                AREA_BAR_CLASSES[index % AREA_BAR_CLASSES.length];

              return (
                <div key={area.area_id}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium">{area.nombre}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      <strong className="font-semibold text-foreground">
                        {area.total_empleados}
                      </strong>{" "}
                      ({formatPorcentaje(area.porcentaje, 1)})
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        barColor,
                      )}
                      style={{
                        width: `${Math.min(100, Math.max(0, area.porcentaje))}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
