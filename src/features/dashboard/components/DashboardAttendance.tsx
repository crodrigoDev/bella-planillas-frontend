import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardPanel from "./DashboardPanel";
import type { DashboardDesignMock } from "../types/dashboard.types";

const states = [
  { key: "puntual", label: "Puntual", color: "#10b981" },
  { key: "tardanza", label: "Tardanza", color: "#f59e0b" },
  { key: "falta", label: "Falta", color: "#f43f5e" },
] as const;

/** Muestra cantidades en barras y permite cambiar la serie desde la leyenda */
export default function DashboardAttendance({
  days,
  total,
}: {
  days: DashboardDesignMock["asistencia"];
  total: number;
}) {
  const [selected, setSelected] = useState<(typeof states)[number]>(states[0]);
  const promedio =
    days.reduce((sum, day) => sum + day[selected.key], 0) / days.length;
  return (
    <DashboardPanel
      title="Asistencia de la semana"
      description="Registro consolidado de los últimos 5 días laborables (Lun – Vie)"
      action={
        <div className="flex rounded-md bg-muted/40 p-1">
          {states.map((item) => (
            <button
              key={item.key}
              aria-pressed={selected.key === item.key}
              onClick={() => setSelected(item)}
              className={
                "flex items-center gap-1 rounded px-2 py-1.5 text-[10px] " +
                (selected.key === item.key
                  ? "bg-background shadow-sm ring-1 ring-border"
                  : "text-muted-foreground")
              }
            >
              <span
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </button>
          ))}
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            <span className="font-medium text-foreground">
              {((promedio / total) * 100).toFixed(1)} %
            </span>{" "}
            · Promedio: {Math.round(promedio)} colaboradores / día
          </span>
          <Link
            to="/marcaciones?fecha_inicio=2026-10-05&fecha_fin=2026-10-09"
            className="font-medium text-primary hover:underline"
          >
            Ver reporte detallado →
          </Link>
        </div>
      }
    >
      <div
        className="h-64 w-full min-w-0"
        aria-label={"Asistencia semanal: " + selected.label}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            accessibilityLayer
            data={days}
            margin={{ top: 24, right: 10, bottom: 0, left: -16 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="dia"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              contentStyle={{
                borderRadius: 8,
                fontSize: 12,
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
              }}
            />
            <Bar
              key={selected.key}
              dataKey={selected.key}
              name={selected.label}
              fill={selected.color}
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
              isAnimationActive={false}
            >
              <LabelList
                dataKey={selected.key}
                position="top"
                fill="var(--foreground)"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardPanel>
  );
}
