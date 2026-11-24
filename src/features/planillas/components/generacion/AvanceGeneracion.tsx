import { useState, type ReactNode } from "react";
import { isAxiosError } from "axios";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import {
  TONE_BADGE,
  type StatusTone,
} from "@/components/feedback/statusTone.config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPeriodo } from "@/lib/periodo.utils";
import { cn } from "@/lib/utils";
import { useEmpleadosMapa } from "../../hooks/useEmpleadosOpciones";
import { useTrabajoPlanillas } from "../../hooks/useGenerarPlanillas";
import type {
  ErrorGeneracion,
  EstadoResultadoGeneracion,
} from "../../types/planillas.types";
import { esEstadoTrabajoFinal, getAvance } from "../../utils/planillas.utils";

interface AvanceGeneracionProps {
  trabajoId: string;
  periodo: string;
  onCerrar: () => void;
}

const RESULTADO_ESTADO: Record<
  EstadoResultadoGeneracion,
  { label: string; tone: StatusTone }
> = {
  COMPLETADO: { label: "Completado", tone: "success" },
  PARCIAL: { label: "Completado con observaciones", tone: "warning" },
  FALLIDO: { label: "Sin planillas generadas", tone: "danger" },
};

function CerrarAvisoButton({ onCerrar }: { onCerrar: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Cerrar aviso"
      onClick={onCerrar}
    >
      <XIcon />
    </Button>
  );
}

interface AvisoCardProps {
  title: string;
  tone?: StatusTone;
  badge?: { label: string; tone: StatusTone };
  subtitle?: ReactNode;
  onCerrar: () => void;
  children?: ReactNode;
}

function AvisoCard({
  title,
  tone,
  badge,
  subtitle,
  onCerrar,
  children,
}: AvisoCardProps) {
  return (
    <Card size="sm" className={cn(tone && ["border", TONE_BADGE[tone]])}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {badge && (
              <StatusBadge tone={badge.tone} withDot>
                {badge.label}
              </StatusBadge>
            )}
          </div>
          {subtitle}
        </div>
        <CerrarAvisoButton onCerrar={onCerrar} />
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}

interface ObservacionesGeneracionProps {
  errores: ErrorGeneracion[];
  erroresTruncados: boolean;
}

function ObservacionesGeneracion({
  errores,
  erroresTruncados,
}: ObservacionesGeneracionProps) {
  const [abiertas, setAbiertas] = useState(false);
  const { nombresPorId } = useEmpleadosMapa();

  return (
    <Collapsible
      open={abiertas}
      onOpenChange={setAbiertas}
      className="space-y-2"
    >
      <CollapsibleTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-background"
          />
        }
      >
        {abiertas
          ? "Ocultar observaciones"
          : `Ver observaciones (${errores.length})`}
        {abiertas ? (
          <ChevronUpIcon data-icon="inline-end" />
        ) : (
          <ChevronDownIcon data-icon="inline-end" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="rounded-lg border bg-background p-3 text-foreground">
        <ul className="space-y-1.5 text-sm">
          {errores.map((item) => (
            <li key={`${item.empleado_id}-${item.detalle}`}>
              <span className="font-medium">
                {nombresPorId.get(item.empleado_id) ??
                  "Colaborador no identificado"}
              </span>{" "}
              — {item.detalle}
            </li>
          ))}
        </ul>
        {erroresTruncados && (
          <p className="mt-2 text-xs text-muted-foreground">
            Se muestran solo las primeras observaciones.
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Tarjeta que muestra el avance y resultado del cálculo de planillas del mes
 */
export function AvanceGeneracion({
  trabajoId,
  periodo,
  onCerrar,
}: AvanceGeneracionProps) {
  const {
    data: trabajo,
    error,
    isLoading,
    refetch,
  } = useTrabajoPlanillas(trabajoId);

  const mes = formatPeriodo(periodo);
  const noEncontrado = isAxiosError(error) && error.response?.status === 404;

  if (isLoading) {
    return (
      <Card size="sm">
        <CardContent className="space-y-2 py-1">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!trabajo) {
    return (
      <AvisoCard
        title={
          noEncontrado
            ? "Ya no se puede consultar este cálculo."
            : "No se pudo consultar el cálculo"
        }
        tone="danger"
        subtitle={
          !noEncontrado ? (
            <ErrorAlert error={error} onRetry={() => refetch()} />
          ) : undefined
        }
        onCerrar={onCerrar}
      />
    );
  }

  const errorPasajero = Boolean(error) && !noEncontrado;
  const terminado = esEstadoTrabajoFinal(trabajo.estado);

  const renderTarjeta = () => {
    if (trabajo.estado === "failed") {
      return (
        <AvisoCard
          title={`Cálculo de planillas de ${mes}`}
          tone="danger"
          subtitle={
            <p className="text-sm">
              No se pudo completar el cálculo. Inténtalo de nuevo.
            </p>
          }
          onCerrar={onCerrar}
        />
      );
    }

    if (!terminado) {
      const { total, procesados, correctos, fallidos } = getAvance(
        trabajo.progreso,
      );
      const porcentaje =
        total > 0
          ? Math.min(100, Math.max(0, Math.round((procesados / total) * 100)))
          : 0;

      return (
        <AvisoCard
          title={`Calculando planillas de ${mes}…`}
          subtitle={
            <p className="text-xs text-muted-foreground">
              {total > 0
                ? `${procesados} de ${total} procesadas · ${correctos} correctas · ${fallidos} con observaciones`
                : "Preparando el cálculo del mes…"}
            </p>
          }
          onCerrar={onCerrar}
        >
          <div
            role="progressbar"
            aria-label={`Avance del cálculo de planillas de ${mes}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={porcentaje}
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </AvisoCard>
      );
    }

    const resultado = trabajo.resultado;

    if (!resultado) {
      return (
        <AvisoCard
          title={`Cálculo de planillas de ${mes} finalizado`}
          onCerrar={onCerrar}
        />
      );
    }

    const estadoVisual = RESULTADO_ESTADO[resultado.estado];

    return (
      <AvisoCard
        title={`Cálculo de planillas de ${mes}`}
        tone={estadoVisual.tone}
        badge={estadoVisual}
        subtitle={
          <p className="text-sm">
            {resultado.correctos} planillas generadas, {resultado.fallidos} con
            observaciones
          </p>
        }
        onCerrar={onCerrar}
      >
        {resultado.errores.length > 0 && (
          <ObservacionesGeneracion
            errores={resultado.errores}
            erroresTruncados={resultado.errores_truncados}
          />
        )}
      </AvisoCard>
    );
  };

  if (!errorPasajero) return renderTarjeta();

  return (
    <div className="space-y-1.5">
      <p role="status" className="text-xs text-muted-foreground">
        No pudimos actualizar el avance; seguimos intentando.
      </p>
      {renderTarjeta()}
    </div>
  );
}
