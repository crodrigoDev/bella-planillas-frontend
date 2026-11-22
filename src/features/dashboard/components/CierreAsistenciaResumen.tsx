import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import { ResumenCifra } from "@/components/page/ResumenCifra";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardRrhhResponseDto } from "../types/dashboard.types";
import { formatPorcentaje } from "../utils/dashboard.utils";

interface CierreAsistenciaResumenProps {
  cierre: DashboardRrhhResponseDto["cierre_asistencia"];
  periodo: string;
}

/**
 * Resumen del estado de cierre mensual de asistencia con enlace directo al módulo
 */
export function CierreAsistenciaResumen({
  cierre,
  periodo,
}: CierreAsistenciaResumenProps) {
  const totalResumenes =
    cierre.pendientes +
    cierre.aprobados +
    cierre.rechazados +
    cierre.sin_calcular;
  const avance =
    totalResumenes > 0 ? (cierre.aprobados / totalResumenes) * 100 : 0;

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardCheck className="size-4" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Cierre del mes</CardTitle>
            <CardDescription className="text-xs">
              Avance de revisión y aprobación de asistencia
            </CardDescription>
          </div>
        </div>

        <CardAction>
          <Link
            to={`${ROUTE_PATHS.asistencia.cierreMensual}?periodo=${periodo}`}
            className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Ir al cierre mensual</span>
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-5">
        {totalResumenes === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay resúmenes de este mes
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <p className="font-medium">
                {cierre.aprobados} de {totalResumenes}{" "}
                {totalResumenes === 1 ? "aprobado" : "aprobados"}
              </p>
              <span className="text-muted-foreground tabular-nums">
                {formatPorcentaje(avance, 0)}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Resúmenes de asistencia aprobados"
              aria-valuemin={0}
              aria-valuemax={totalResumenes}
              aria-valuenow={cierre.aprobados}
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-success transition-all duration-300"
                style={{ width: `${avance}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <ResumenCifra
            label="Por aprobar"
            value={cierre.pendientes}
            className={cierre.pendientes > 0 ? TONE_TEXT.warning : undefined}
          />
          <ResumenCifra
            label="Aprobados"
            value={cierre.aprobados}
            className={cierre.aprobados > 0 ? TONE_TEXT.success : undefined}
          />
          <ResumenCifra
            label="Rechazados"
            value={cierre.rechazados}
            className={cierre.rechazados > 0 ? TONE_TEXT.danger : undefined}
          />
          <ResumenCifra
            label="Sin calcular"
            value={cierre.sin_calcular}
            className={
              cierre.sin_calcular > 0 ? "text-muted-foreground" : undefined
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
