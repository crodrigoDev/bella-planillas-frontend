import { Cake } from "lucide-react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTodayIsoDate } from "@/lib/date.utils";
import { cn } from "@/lib/utils";
import type { DashboardRrhhResponseDto } from "../types/dashboard.types";
import {
  formatDiaMesLargo,
  formatNombreMes,
  getIniciales,
} from "../utils/dashboard.utils";

interface BirthdaysListProps {
  cumpleanos: DashboardRrhhResponseDto["cumpleanos"];
  periodo: string;
  esMesActual: boolean;
}

/**
 * Lista de cumpleaños de colaboradores activos durante el mes seleccionado
 */
export function BirthdaysList({
  cumpleanos,
  periodo,
  esMesActual,
}: BirthdaysListProps) {
  const { total_mes, primeros } = cumpleanos;
  const restantes = Math.max(0, total_mes - primeros.length);
  const mesNombre = formatNombreMes(periodo);
  const sufijoMes = esMesActual ? "este mes" : `en ${mesNombre}`;

  const [, hoyMes, hoyDia] = getTodayIsoDate().split("-").map(Number);

  return (
    <Card className="h-full justify-between">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cake className="size-4" aria-hidden="true" />
          </div>
          <CardTitle>Cumpleaños del mes</CardTitle>
        </div>

        <CardAction>
          <Badge variant="secondary">
            {total_mes} en {mesNombre}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1">
        {primeros.length === 0 ? (
          <EmptyState title={`No hay cumpleaños ${sufijoMes}`} />
        ) : (
          <div className="divide-y">
            {primeros.map((persona) => {
              const esHoy =
                esMesActual && persona.mes === hoyMes && persona.dia === hoyDia;

              return (
                <div
                  key={persona.empleado_id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      aria-hidden="true"
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold",
                        esHoy
                          ? "border-success-border bg-success-soft text-success-soft-foreground"
                          : "border-primary/20 bg-primary/10 text-primary",
                      )}
                    >
                      {getIniciales(persona.nombre_completo)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">
                          {persona.nombre_completo}
                        </span>
                        {esHoy && <StatusBadge tone="success">Hoy</StatusBadge>}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {persona.area} · {persona.cargo}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-foreground">
                    {formatDiaMesLargo(persona.dia, persona.mes)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {restantes > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            y {restantes} más {sufijoMes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
