import { useId, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarCheck2, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts";

import { ROUTE_PATHS } from "@/app/routes/path";
import { TONE_DOT } from "@/components/feedback/statusTone.config";
import {
  Card,
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
import {
  formatFechaHoraLima,
  getTodayIsoDate,
  toDateInput,
} from "@/lib/date.utils";
import { cn } from "@/lib/utils";
import type {
  DashboardRrhhResponseDto,
  IndicadorAsistencia,
} from "../types/dashboard.types";
import {
  formatDiaCompleto,
  formatDiaMesCorto,
  formatDiaSemanaCorto,
  formatPorcentaje,
  parseFechaUtc,
} from "../utils/dashboard.utils";

interface WeeklyAttendanceProps {
  asistencia: DashboardRrhhResponseDto["asistencia_semana"];
  esMesActual: boolean;
  /** Periodo mostrado (YYYY-MM), para enlazar con el cierre mensual */
  periodo: string;
}

type DiaSemana = DashboardRrhhResponseDto["asistencia_semana"]["dias"][number];
type EstadoDia =
  | "puntuales"
  | "tardanzas"
  | "faltas"
  | "justificadas"
  | "pendientes";

/**
 * Fila del gráfico: un día laborable.
 * - Con datos: `valor` es el conteo del indicador elegido.
 * - Descanso: día pasado sin colaboradores esperados; no se dibuja pero la curva lo cruza.
 * - Sin datos todavía (futuro o sin resumen): `valor` es `null` y no se dibuja.
 */
interface FilaDia extends Partial<Omit<DiaSemana, "fecha">> {
  /** Posición 0 a 4 en el eje X numérico, para poder pintar la banda de cada día */
  indice: number;
  fecha: string;
  conDatos: boolean;
  descanso: boolean;
  valor: number | null;
}

/** Estados que se detallan en el tooltip del día */
const ESTADOS: EstadoDia[] = [
  "puntuales",
  "tardanzas",
  "faltas",
  "justificadas",
  "pendientes",
];

const ESTADO_LABEL: Record<EstadoDia, string> = {
  puntuales: "Puntuales",
  tardanzas: "Tardanzas",
  faltas: "Faltas",
  justificadas: "Justificadas",
  pendientes: "Pendientes",
};

const DOT_CLASS: Record<EstadoDia, string> = {
  puntuales: TONE_DOT.success,
  tardanzas: TONE_DOT.warning,
  faltas: TONE_DOT.danger,
  justificadas: TONE_DOT.info,
  pendientes: TONE_DOT.neutral,
};

/** Indicadores que el usuario puede elegir; cada uno pinta la serie con su tono de estado */
const TABS_ORDER: IndicadorAsistencia[] = ["puntuales", "tardanzas", "faltas"];

const CHART_CONFIG: Record<IndicadorAsistencia, ChartConfig> = {
  puntuales: { valor: { label: "Puntuales", color: "var(--success)" } },
  tardanzas: { valor: { label: "Tardanzas", color: "var(--warning)" } },
  faltas: { valor: { label: "Faltas", color: "var(--destructive)" } },
};

const AVG_LABEL: Record<IndicadorAsistencia, string> = {
  puntuales: "puntuales",
  tardanzas: "con tardanza",
  faltas: "faltas",
};

/** Genera las 5 fechas laborables (lunes a viernes) a partir de `desde` sin desfase horario */
const getFechasSemana = (desde: string): string[] => {
  const inicio = parseFechaUtc(desde);

  return Array.from({ length: 5 }, (_, offset) => {
    const fecha = new Date(inicio);
    fecha.setUTCDate(inicio.getUTCDate() + offset);
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getUTCDate()).padStart(2, "0");

    return `${fecha.getUTCFullYear()}-${mes}-${dia}`;
  });
};

interface DiaTickProps {
  x?: number | string;
  y?: number | string;
  fila?: FilaDia;
}

/** Etiqueta del eje: día de la semana y fecha corta; en gris si no hay datos, con "Descanso" si lo es */
function DiaTick({ x = 0, y = 0, fila }: DiaTickProps) {
  if (!fila) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" dy={16}>
        <tspan
          className={cn(
            "text-xs font-semibold",
            fila.conDatos ? "fill-foreground" : "fill-muted-foreground",
          )}
        >
          {formatDiaSemanaCorto(fila.fecha)}
        </tspan>
        <tspan x={0} dy={14} className="fill-muted-foreground text-[11px]">
          {formatDiaMesCorto(fila.fecha)}
        </tspan>
        {fila.descanso && (
          <tspan x={0} dy={14} className="fill-muted-foreground text-[11px]">
            Descanso
          </tspan>
        )}
      </text>
    </g>
  );
}

interface EtiquetaDiaProps {
  x?: number | string;
  y?: number | string;
  index?: number;
}

/**
 * Asistencia de la semana (lunes a viernes) en un gráfico de área con el
 * indicador elegido. Los días sin datos quedan como hueco, no como cero.
 */
export function WeeklyAttendance({
  asistencia,
  esMesActual,
  periodo,
}: WeeklyAttendanceProps) {
  const [activeTab, setActiveTab] = useState<IndicadorAsistencia>("puntuales");
  const gradientId = `asistencia-${useId().replace(/:/g, "")}`;

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
  const hoy = getTodayIsoDate();
  const filas: FilaDia[] = getFechasSemana(desde).map((fecha, indice) => {
    const dia = diasPorFecha.get(fecha);

    if (dia && dia.esperados > 0) {
      return { ...dia, indice, fecha, conDatos: true, descanso: false, valor: dia[activeTab] };
    }

    // Un día pasado con resumen pero sin esperados es de descanso; el resto aún no tiene datos
    const descanso = Boolean(dia) && fecha <= hoy;

    return { indice, fecha, conDatos: false, descanso, valor: null };
  });

  // Solo cuentan los días con colaboradores esperados, igual que en el promedio
  const diasConEsperados = dias.filter((dia) => dia.esperados > 0);
  const totalDe = (estado: EstadoDia) =>
    diasConEsperados.reduce((acc, dia) => acc + dia[estado], 0);

  const totalPendientes = totalDe("pendientes");
  const promedioDia =
    diasConEsperados.length > 0
      ? Number((totalDe(activeTab) / diasConEsperados.length).toFixed(1))
      : 0;

  // Escala común de la semana: de cero al máximo de esperados
  const maxEsperados = Math.max(1, ...diasConEsperados.map((dia) => dia.esperados));

  // Sin ningún dato revisado en la semana y con pendientes, no hay curva que mostrar: se avisa que falta revisar
  const sinRevisados =
    totalDe("puntuales") +
      totalDe("tardanzas") +
      totalDe("faltas") +
      totalDe("justificadas") ===
    0;
  const porRevisar = sinRevisados && totalPendientes > 0;
  const textoPorRevisar = `${totalPendientes} ${
    totalPendientes === 1 ? "asistencia por revisar" : "asistencias por revisar"
  }`;

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
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <div>
            <p className="text-4xl leading-none font-semibold tracking-tight tabular-nums">
              {puntualidad_porcentaje !== null
                ? formatPorcentaje(puntualidad_porcentaje, 1)
                : "—"}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Puntualidad de la semana
            </p>
          </div>
          {!sinAsistencia && !porRevisar && (
            <p className="text-sm text-muted-foreground">
              Promedio: {promedioDia} {AVG_LABEL[activeTab]} / día
            </p>
          )}
        </div>

        <div
          role="group"
          aria-label="Indicador de asistencia"
          className="flex flex-wrap gap-2"
        >
          {TABS_ORDER.map((tab) => {
            const isSelected = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-foreground/25 bg-muted font-semibold text-foreground"
                    : "bg-card font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("size-2.5 rounded-[3px]", DOT_CLASS[tab])}
                />
                <span>{ESTADO_LABEL[tab]}</span>
                <span className="tabular-nums">{totalDe(tab)}</span>
              </button>
            );
          })}
        </div>

        {sinAsistencia ? (
          <div className="flex h-60 flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 text-center">
            <p className="font-medium">
              {esMesActual
                ? "Todavía no hay asistencia registrada esta semana"
                : `No hay asistencia registrada en la semana del ${formatDiaMesCorto(desde)} al ${formatDiaMesCorto(hasta)}`}
            </p>
          </div>
        ) : porRevisar ? (
          <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 px-4 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-warning-soft text-warning-soft-foreground">
              <ClipboardList className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">
                La asistencia de esta semana aún está por revisar
              </p>
              <p className="text-sm text-muted-foreground">
                {textoPorRevisar}
              </p>
            </div>
            <Link
              to={`${ROUTE_PATHS.asistencia.cierreMensual}?periodo=${periodo}`}
              className="group inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>Ir al cierre mensual</span>
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : (
          <>
            <ChartContainer
              config={CHART_CONFIG[activeTab]}
              className="aspect-auto h-60 w-full justify-start"
              aria-hidden="true"
            >
              <AreaChart
                data={filas}
                accessibilityLayer={false}
                margin={{ top: 30, right: 16, bottom: 0, left: 16 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      style={{ stopColor: "var(--color-valor)", stopOpacity: 0.4 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "var(--color-valor)", stopOpacity: 0.02 }}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 4" />
                <XAxis
                  dataKey="indice"
                  type="number"
                  domain={[-0.5, 4.5]}
                  ticks={[0, 1, 2, 3, 4]}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={58}
                  tick={(props) => (
                    <DiaTick
                      x={props.x}
                      y={props.y}
                      fila={filas[props.payload.value]}
                    />
                  )}
                />
                <YAxis hide domain={[0, maxEsperados]} />
                {filas
                  .filter((fila) => fila.descanso)
                  .map((fila) => (
                    <ReferenceArea
                      key={fila.fecha}
                      x1={fila.indice - 0.5}
                      x2={fila.indice + 0.5}
                      fill="var(--muted)"
                      fillOpacity={0.6}
                      stroke="none"
                      ifOverflow="visible"
                    />
                  ))}
                <ChartTooltip
                  cursor={{ stroke: "var(--border)" }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        const fila = payload[0]?.payload as FilaDia | undefined;

                        return fila ? formatDiaCompleto(fila.fecha) : null;
                      }}
                      formatter={(_, __, item) => {
                        const fila = item.payload as FilaDia;

                        return (
                          <div className="grid w-full gap-1.5">
                            <p className="text-muted-foreground">
                              Esperados:{" "}
                              <strong className="font-semibold text-foreground tabular-nums">
                                {fila.esperados}
                              </strong>
                            </p>
                            <ul className="grid gap-1.5 border-t pt-1.5">
                              {ESTADOS.map((estado) => (
                                <li
                                  key={estado}
                                  className="flex items-center gap-2"
                                >
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "size-2.5 shrink-0 rounded-[3px]",
                                      DOT_CLASS[estado],
                                    )}
                                  />
                                  <span className="flex-1 text-muted-foreground">
                                    {ESTADO_LABEL[estado]}
                                  </span>
                                  <span className="font-semibold tabular-nums">
                                    {fila[estado]}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Area
                  dataKey="valor"
                  type="monotone"
                  connectNulls
                  stroke="var(--color-valor)"
                  strokeWidth={2.5}
                  fill={`url(#${gradientId})`}
                  dot={{
                    r: 4.5,
                    fill: "var(--color-valor)",
                    stroke: "var(--card)",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 6, fill: "var(--color-valor)", stroke: "var(--card)", strokeWidth: 2 }}
                >
                  <LabelList
                    dataKey="valor"
                    content={(props) => {
                      const { x, y, index } = props as EtiquetaDiaProps;
                      const fila =
                        index === undefined ? undefined : filas[index];

                      if (!fila?.conDatos) return null;

                      return (
                        <text
                          x={Number(x)}
                          y={Number(y) - 12}
                          textAnchor="middle"
                          className="fill-foreground text-[11px] font-semibold tabular-nums"
                        >
                          {fila.valor}/{fila.esperados}
                        </text>
                      );
                    }}
                  />
                </Area>
              </AreaChart>
            </ChartContainer>

            <table className="sr-only">
              <caption>Asistencia por día de la semana</caption>
              <thead>
                <tr>
                  <th scope="col">Día</th>
                  <th scope="col">Esperados</th>
                  {ESTADOS.map((estado) => (
                    <th key={estado} scope="col">
                      {ESTADO_LABEL[estado]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.fecha}>
                    <th scope="row">{formatDiaCompleto(fila.fecha)}</th>
                    <td>
                      {fila.conDatos
                        ? fila.esperados
                        : fila.descanso
                          ? "Descanso"
                          : "Sin datos"}
                    </td>
                    {ESTADOS.map((estado) => (
                      <td key={estado}>{fila.conDatos ? fila[estado] : "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(dias_empleado_sin_jornada > 0 ||
          (totalPendientes > 0 && !porRevisar)) && (
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
            {totalPendientes > 0 && !porRevisar && (
              <span className="text-xs font-medium text-muted-foreground">
                {textoPorRevisar}
              </span>
            )}
          </div>
        )}
      </CardContent>

      {ultima_actualizacion && (
        <CardFooter className="bg-transparent py-3 text-xs text-muted-foreground">
          Actualizado el {formatFechaHoraLima(ultima_actualizacion)}
        </CardFooter>
      )}
    </Card>
  );
}
