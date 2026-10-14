import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  RefreshCw,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "../types/dashboard.types";

/** Presenta las cuatro cifras principales del diseño de Recursos Humanos */
export default function DashboardMetrics({ data }: { data: DashboardData }) {
  const metrics = [
    {
      label: "Colaboradores activos",
      value: data.resumen.dotacion.total_activos,
      delta: "+4 vs. septiembre",
      icon: Users,
      tone: "bg-primary/5 text-primary",
      link: "/empleados?activo=true",
      linkLabel: "Ver listado de activos",
      down: false,
    },
    {
      label: "Ingresos del periodo",
      value: data.resumen.dotacion.altas_mes,
      delta: "+5 vs. septiembre",
      icon: UserPlus,
      tone: "bg-emerald-50 text-emerald-600",
      link: "/empleados",
      linkLabel: "Ver colaboradores",
      down: false,
    },
    {
      label: "Ceses del periodo",
      value: data.diseño.ceses_mes,
      delta: "−1 vs. septiembre",
      icon: UserMinus,
      tone: "bg-amber-50 text-amber-600",
      link: "/empleados?activo=false",
      linkLabel: "Ver cesados",
      down: true,
    },
    {
      label: "Rotación de personal",
      value: `${data.diseño.rotacion_porcentaje} %`,
      delta: "−0.8 pp vs. septiembre",
      icon: RefreshCw,
      tone: "bg-indigo-50 text-indigo-500",
      down: true,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="gap-0 border border-indigo-100/80 py-5 shadow-sm ring-0 dark:border-border"
        >
          <CardContent className="space-y-3 px-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </h2>
              <span className={`rounded-md p-1.5 ${metric.tone}`}>
                <metric.icon aria-hidden className="size-4" />
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-3xl font-semibold tracking-tight">
                {metric.value}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-700">
                {metric.down ? (
                  <ArrowDown aria-hidden className="size-3" />
                ) : (
                  <ArrowUp aria-hidden className="size-3" />
                )}
                {metric.delta}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {metric.label === "Rotación de personal" ? "Tasa mensual · " : ""}
              Octubre 2026
            </p>
            <div className="min-h-7 border-t border-border/50 pt-3">
              {metric.link && (
                <Link
                  to={metric.link}
                  className="text-[10px] font-medium text-primary hover:underline"
                >
                  {metric.linkLabel} →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
