import { ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Cell, Label, Pie, PieChart } from "recharts";

import { ROUTE_PATHS } from "@/app/routes/path";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardRrhhResponseDto } from "../types/dashboard.types";
import { formatPorcentaje } from "../utils/dashboard.utils";

type AreaDto = DashboardRrhhResponseDto["dotacion"]["distribucion_areas"][number];

interface AreaDistributionProps {
  areas: DashboardRrhhResponseDto["dotacion"]["distribucion_areas"];
  totalActivos: number;
}

const CHART_CONFIG = {
  total_empleados: { label: "Colaboradores" },
} satisfies ChartConfig;

/**
 * Colores de las porciones en orden de tamaño: el índigo del sistema y luego las
 * categorías (verde, ámbar, turquesa, azul, pizarra), claramente distintas entre sí;
 * con más de seis áreas la lista vuelve a empezar
 */
const COLORES_AREA = [
  "var(--chart-3)",
  "var(--category-2)",
  "var(--category-3)",
  "var(--category-4)",
  "var(--category-1)",
  "var(--category-5)",
] as const;

const getColorArea = (index: number): string =>
  COLORES_AREA[index % COLORES_AREA.length];

const textoColaboradores = (total: number): string =>
  total === 1 ? "colaborador" : "colaboradores";

/**
 * Distribución de colaboradores activos por área en una dona con el total al
 * centro y, debajo (o al lado en pantallas medianas), la leyenda con nombre,
 * cantidad y porcentaje
 */
export function AreaDistribution({
  areas,
  totalActivos,
}: AreaDistributionProps) {
  const sinActivos = totalActivos === 0 || areas.length === 0;

  return (
    <Card className="h-full justify-between">
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
          <div className="flex flex-col items-center gap-6 sm:max-lg:flex-row sm:max-lg:gap-8">
            <ChartContainer
              config={CHART_CONFIG}
              className="aspect-square size-48 shrink-0 sm:max-lg:size-52"
              aria-hidden="true"
            >
              <PieChart accessibilityLayer={false}>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(_, __, item) => {
                        const area = item.payload as AreaDto;

                        return (
                          <div className="grid gap-0.5">
                            <p className="font-semibold">{area.nombre}</p>
                            <p className="text-muted-foreground">
                              <strong className="font-semibold text-foreground tabular-nums">
                                {area.total_empleados}
                              </strong>{" "}
                              {textoColaboradores(area.total_empleados)} (
                              {formatPorcentaje(area.porcentaje, 1)})
                            </p>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie
                  data={areas}
                  dataKey="total_empleados"
                  nameKey="nombre"
                  innerRadius="62%"
                  outerRadius="100%"
                  paddingAngle={areas.length > 1 ? 2 : 0}
                  cornerRadius={4}
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {areas.map((area, index) => (
                    <Cell key={area.area_id} fill={getColorArea(index)} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox)) return null;

                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) - 6}
                            className="fill-foreground text-3xl font-semibold tabular-nums"
                          >
                            {totalActivos}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 16}
                            className="fill-muted-foreground text-xs"
                          >
                            {totalActivos === 1 ? "activo" : "activos"}
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            <ul
              aria-label="Colaboradores activos por área"
              className="w-full min-w-0 space-y-2.5"
            >
              {areas.map((area, index) => (
                <li
                  key={area.area_id}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-[3px]"
                    style={{ backgroundColor: getColorArea(index) }}
                  />
                  <span className="min-w-0 flex-1 truncate" title={area.nombre}>
                    {area.nombre}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {area.total_empleados}
                  </span>
                  <span className="w-14 shrink-0 text-right text-muted-foreground tabular-nums">
                    {formatPorcentaje(area.porcentaje, 1)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-transparent py-3">
        <Link
          to={ROUTE_PATHS.organizacion.areas}
          className="group inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>Ver áreas</span>
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </CardFooter>
    </Card>
  );
}
