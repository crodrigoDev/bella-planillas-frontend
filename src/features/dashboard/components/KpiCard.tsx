import {
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { TONE_BADGE } from "@/components/feedback/statusTone.config";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { KpiDelta } from "../types/dashboard.types";

/** Valores del mes anterior y del mes mostrado, para el mini gráfico de la tarjeta */
export interface KpiComparacion {
  anterior: number;
  actual: number;
}

interface KpiCardProps {
  title: string;
  value: string | number;
  delta: KpiDelta;
  icon: LucideIcon;
  /** Clases de color del contenedor del icono usando tokens del tema */
  iconClassName?: string;
  /** Si se pasa, dibuja dos barras pequeñas: mes anterior frente al mes mostrado */
  comparacion?: KpiComparacion;
  /** Ruta destino opcional; solo algunas tarjetas navegan a un módulo */
  linkTo?: string;
  linkLabel?: string;
}

const COMPARACION_CONFIG = {
  anterior: { label: "Mes anterior", color: "var(--chart-1)" },
  actual: { label: "Este mes", color: "var(--chart-3)" },
} satisfies ChartConfig;

const TREND_ICON = {
  sube: ArrowUpRight,
  baja: ArrowDownRight,
  igual: Minus,
} as const;

/**
 * Dos barras pequeñas (mes anterior y mes mostrado) que parten de cero.
 * Es decorativa: el texto de la variación ya dice lo mismo.
 */
function KpiComparacionBars({ comparacion }: { comparacion: KpiComparacion }) {
  const { anterior, actual } = comparacion;

  // Sin datos en ninguno de los dos meses no hay nada que comparar
  if (anterior <= 0 && actual <= 0) return null;

  const data = [
    { clave: "anterior", valor: anterior },
    { clave: "actual", valor: actual },
  ];

  return (
    <ChartContainer
      config={COMPARACION_CONFIG}
      className="aspect-auto h-12 w-16 shrink-0"
      aria-hidden="true"
    >
      <BarChart
        data={data}
        accessibilityLayer={false}
        margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap={6}
      >
        <XAxis dataKey="clave" hide />
        <YAxis hide domain={[0, "dataMax"]} />
        <Bar
          dataKey="valor"
          radius={[4, 4, 0, 0]}
          minPointSize={(valor) => (valor && valor > 0 ? 3 : 0)}
          isAnimationActive={false}
        >
          {data.map((item) => (
            <Cell key={item.clave} fill={`var(--color-${item.clave})`} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

/**
 * Tarjeta de indicador principal del dashboard: cifra grande, variación frente
 * al mes anterior en una pastilla y, si hay datos, la comparación en barras
 */
export function KpiCard({
  title,
  value,
  delta,
  icon: Icon,
  iconClassName,
  comparacion,
  linkTo,
  linkLabel,
}: KpiCardProps) {
  const TrendIcon = TREND_ICON[delta.tendencia];

  return (
    <Card className="h-full justify-between">
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              iconClassName ?? "bg-primary/10 text-primary",
            )}
          >
            <Icon className="size-[18px]" aria-hidden="true" />
          </div>
          <span className="text-sm leading-tight font-medium text-muted-foreground">
            {title}
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 space-y-2.5">
            <p className="text-4xl leading-none font-semibold tracking-tight tabular-nums">
              {value}
            </p>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border py-0.5 pr-2.5 pl-1.5 text-xs font-medium",
                TONE_BADGE[delta.tone],
              )}
            >
              <TrendIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{delta.texto}</span>
            </span>
          </div>
          {comparacion && <KpiComparacionBars comparacion={comparacion} />}
        </div>
      </CardContent>

      {linkTo && linkLabel && (
        <CardFooter className="bg-transparent py-3">
          <Link
            to={linkTo}
            className="group inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>{linkLabel}</span>
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
