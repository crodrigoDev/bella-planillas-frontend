import { useState } from "react";
import { AlertTriangle, CalendarCheck2 } from "lucide-react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFechaHoraLima, toDateInput } from "@/lib/date.utils";
import { cn } from "@/lib/utils";
import type {
  DashboardRrhhResponseDto,
  IndicadorAsistencia,
} from "../types/dashboard.types";
import {
  formatDiaMesCorto,
  formatDiaSemanaCorto,
  formatPorcentaje,
} from "../utils/dashboard.utils";

interface WeeklyAttendanceProps {
  asistencia: DashboardRrhhResponseDto["asistencia_semana"];
  esMesActual: boolean;
}

const TABS_CONFIG: Record<
  IndicadorAsistencia,
  {
    label: string;
    avgLabel: string;
    barClass: string;
    dotClass: string;
    textClass: string;
  }
> = {
  puntuales: {
    label: "Puntuales",
    avgLabel: "puntuales",
    barClass: "bg-success",
    dotClass: "bg-success",
    textClass: TONE_TEXT.success,
  },
  tardanzas: {
    label: "Tardanzas",
    avgLabel: "con tardanza",
    barClass: "bg-warning",
    dotClass: "bg-warning",
    textClass: TONE_TEXT.warning,
  },
  faltas: {
    label: "Faltas",
    avgLabel: "faltas",
    barClass: "bg-destructive",
    dotClass: "bg-destructive",
    textClass: TONE_TEXT.danger,
  },
};

const TABS_ORDER: IndicadorAsistencia[] = ["puntuales", "tardanzas", "faltas"];

/** Genera las 5 fechas laborables (lunes a viernes) a partir de `desde` sin desfase horario */
const getFechasSemana = (desde: string): string[] => {
  const [year, month, day] = toDateInput(desde).split("-").map(Number);

  return Array.from({ length: 5 }, (_, offset) => {
    const fecha = new Date(Date.UTC(year, month - 1, day + offset));
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getUTCDate()).padStart(2, "0");

    return `${fecha.getUTCFullYear()}-${mes}-${dia}`;
  });
};

/**
 * Gráfico semanal de asistencia por día laborable con selector de indicador
 */
export function WeeklyAttendance({
  asistencia,
  esMesActual,
}: WeeklyAttendanceProps) {
  const [activeTab, setActiveTab] = useState<IndicadorAsistencia>("puntuales");
  const config = TABS_CONFIG[activeTab];

  const {
    desde,
    hasta,
    dias,
    puntualidad_porcentaje,
    ultima_actualizacion,
    dias_empleado_sin_jornada,
  } = asistencia;

  const sinAsistencia =
    dias.length === 0 || dias.every((dia) => dia.esperados === 0);

  const diasPorFecha = new Map(
    dias.map((dia) => [toDateInput(dia.fecha), dia]),
  );
  const fechasSemana = getFechasSemana(desde);

  const totalPendientes = dias.reduce((acc, dia) => acc + dia.pendientes, 0);
  const diasConEsperados = dias.filter((dia) => dia.esperados > 0);
  const promedioDia =
    diasConEsperados.length > 0
      ? Number(
          (
            diasConEsperados.reduce((acc, dia) => acc + dia[activeTab], 0) /
            diasConEsperados.length
          ).toFixed(1),
        )
      : 0;

  const maxTabValor = Math.max(...dias.map((dia) => dia[activeTab]), 1);

  return (
    <Card className="h-full justify-between">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarCheck2 className="size-4" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Asistencia de la semana</CardTitle>
            <CardDescription className="text-xs">
              Del {formatDiaMesCorto(desde)} al {formatDiaMesCorto(hasta)}
            </CardDescription>
          </div>
        </div>

        <CardAction>
          <div
            role="group"
            aria-label="Indicador de asistencia"
            className="inline-flex items-center gap-1 rounded-lg border bg-muted p-1 text-xs"
          >
            {TABS_ORDER.map((tab) => {
              const item = TABS_CONFIG[tab];
              const isSelected = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all",
                    isSelected
                      ? cn("border bg-card font-semibold shadow-xs", item.textClass)
                      : "font-medium text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-2 rounded-full", item.dotClass)}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        {sinAsistencia ? (
          <EmptyState
            title={
              esMesActual
                ? "Todavía no hay asistencia registrada esta semana"
                : `No hay asistencia registrada en la semana del ${formatDiaMesCorto(desde)} al ${formatDiaMesCorto(hasta)}`
            }
          />
        ) : (
          <div className="grid h-48 grid-cols-5 items-end gap-3 pt-4 sm:gap-5">
            {fechasSemana.map((fecha) => {
              const dia = diasPorFecha.get(fecha);

              if (!dia) {
                return (
                  <div
                    key={fecha}
                    className="flex h-full flex-col items-center justify-end"
                  >
                    <span className="mb-2 text-[11px] font-semibold text-muted-foreground">
                      —
                    </span>
                    <div className="flex h-full w-full max-w-12 flex-col justify-end rounded-lg border border-dashed bg-muted/30 p-1" />
                    <span className="mt-2 text-xs font-semibold text-muted-foreground">
                      {formatDiaSemanaCorto(fecha)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDiaMesCorto(fecha)}
                    </span>
                  </div>
                );
              }

              const valor = dia[activeTab];
              const altura =
                activeTab === "puntuales"
                  ? dia.esperados > 0
                    ? (valor / dia.esperados) * 100
                    : 0
                  : valor > 0
                    ? Math.max((valor / maxTabValor) * 100, 8)
                    : 0;

              return (
                <div
                  key={fecha}
                  className="flex h-full flex-col items-center justify-end"
                >
                  <span className="mb-2 text-[11px] font-semibold tabular-nums text-foreground">
                    {valor}/{dia.esperados}
                  </span>
                  <div className="flex h-full w-full max-w-12 flex-col justify-end rounded-lg border bg-muted/60 p-1">
                    <div
                      className={cn(
                        "w-full rounded-md transition-all duration-300",
                        config.barClass,
                      )}
                      style={{ height: `${Math.min(100, Math.max(0, altura))}%` }}
                    />
                  </div>
                  <span className="mt-2 text-xs font-semibold">
                    {formatDiaSemanaCorto(fecha)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDiaMesCorto(fecha)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {(totalPendientes > 0 || dias_empleado_sin_jornada > 0) && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {dias_empleado_sin_jornada > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-warning-border bg-warning-soft px-2.5 py-1.5 text-xs text-warning-soft-foreground">
                <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {dias_empleado_sin_jornada}{" "}
                  {dias_empleado_sin_jornada === 1 ? "día" : "días"} de
                  colaboradores sin jornada asignada
                </span>
              </div>
            )}
            {totalPendientes > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                {totalPendientes}{" "}
                {totalPendientes === 1 ? "día por revisar" : "días por revisar"}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-wrap justify-between gap-2 bg-transparent py-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            Puntualidad:{" "}
            <strong className="font-semibold text-foreground">
              {puntualidad_porcentaje !== null
                ? formatPorcentaje(puntualidad_porcentaje, 1)
                : "—"}
            </strong>
          </span>
          {!sinAsistencia && (
            <>
              <span aria-hidden="true">•</span>
              <span>
                Promedio: {promedioDia} {config.avgLabel} / día
              </span>
            </>
          )}
        </div>

        {ultima_actualizacion && (
          <span>
            Actualizado el {formatFechaHoraLima(ultima_actualizacion)}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
