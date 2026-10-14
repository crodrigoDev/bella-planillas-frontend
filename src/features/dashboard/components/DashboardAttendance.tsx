import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import type { DashboardDesignMock } from "../types/dashboard.types";

const states = [
  { key: "puntual", label: "Puntual", color: "bg-emerald-500" },
  { key: "tardanza", label: "Tardanza", color: "bg-amber-400" },
  { key: "falta", label: "Falta", color: "bg-rose-500" },
] as const;

/** Cambia la serie visible con los botones de la leyenda */
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
        <div className="flex rounded-md bg-slate-50 p-1 dark:bg-muted">
          {states.map((item) => (
            <button
              key={item.key}
              aria-pressed={selected.key === item.key}
              onClick={() => setSelected(item)}
              className={`flex items-center gap-1 rounded px-2 py-1.5 text-[10px] ${selected.key === item.key ? "bg-background shadow-sm ring-1 ring-border" : "text-muted-foreground"}`}
            >
              <span
                aria-hidden
                className={`size-1.5 rounded-full ${item.color}`}
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
      <div className="flex h-60 items-end justify-around gap-3 pb-1 pt-3">
        {days.map((day) => (
          <div
            key={day.fecha}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span className="text-[10px] font-medium tabular-nums">
              {day[selected.key]}/{total}
            </span>
            <div
              role="img"
              aria-label={`${day.dia}: ${day[selected.key]} de ${total} colaboradores, ${selected.label}`}
              className="relative h-40 w-full max-w-10 overflow-hidden rounded-md bg-slate-100 dark:bg-muted"
            >
              <div
                className={`absolute bottom-0 w-full rounded-md ${selected.color}`}
                style={{ height: `${(day[selected.key] / total) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-medium">{day.dia}</p>
              <p className="mt-0.5 text-[9px] text-muted-foreground">
                {Number(day.fecha.slice(-2))} oct.
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
