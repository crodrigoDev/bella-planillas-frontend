import {
  ArrowRight,
  Minus,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { TONE_BADGE } from "@/components/feedback/statusTone.config";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { KpiDelta } from "../types/dashboard.types";

interface KpiCardProps {
  title: string;
  value: string | number;
  delta: KpiDelta;
  icon: LucideIcon;
  /** Clases de color del contenedor del icono usando tokens del tema */
  iconClassName?: string;
  /** Ruta destino opcional; solo algunas tarjetas navegan a un módulo */
  linkTo?: string;
  linkLabel?: string;
}

/**
 * Tarjeta de indicador principal del dashboard con variación frente al mes anterior
 */
export function KpiCard({
  title,
  value,
  delta,
  icon: Icon,
  iconClassName,
  linkTo,
  linkLabel,
}: KpiCardProps) {
  const TrendIcon =
    delta.tendencia === "sube"
      ? TrendingUp
      : delta.tendencia === "baja"
        ? TrendingDown
        : Minus;

  return (
    <Card className="justify-between">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {title}
          </span>
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              iconClassName ?? "bg-primary/10 text-primary",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold tracking-tight tabular-nums">
            {value}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
              TONE_BADGE[delta.tone],
            )}
          >
            <TrendIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{delta.texto}</span>
          </span>
        </div>
      </CardContent>

      {linkTo && linkLabel && (
        <CardFooter className="bg-transparent py-3">
          <Link
            to={linkTo}
            className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
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
