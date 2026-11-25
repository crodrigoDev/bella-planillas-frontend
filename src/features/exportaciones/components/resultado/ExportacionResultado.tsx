import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { AlertTriangleIcon, XIcon } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { formatPeriodo } from "@/lib/periodo.utils";
import {
  UMBRAL_CONSULTA_LENTA_MS,
  useExportacion,
} from "../../hooks/useExportaciones";
import {
  esEstadoFinal,
  getTipoExportacionLabel,
  tieneArchivos,
  traducirErrorExportacion,
} from "../../utils/exportaciones.utils";
import { EstadoExportacionBadge } from "../EstadoExportacionBadge";
import { ExportacionArchivosTabla } from "./ExportacionArchivosTabla";
import { ExportacionCorreosResumen } from "./ExportacionCorreosResumen";

interface ExportacionResultadoProps {
  exportacionId: string;
  /** Desplaza la tarjeta a la vista y enfoca su título cuando proviene de una solicitud nueva */
  autoEnfocar?: boolean;
  onCerrar: () => void;
}

function CerrarResultadoButton({ onCerrar }: { onCerrar: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Cerrar resultado"
      onClick={onCerrar}
    >
      <XIcon />
    </Button>
  );
}

/**
 * Tarjeta que muestra el avance en curso, posibles avisos y archivos descargables de una exportación
 */
export function ExportacionResultado({
  exportacionId,
  autoEnfocar = false,
  onCerrar,
}: ExportacionResultadoProps) {
  const [tardoParaId, setTardoParaId] = useState<string | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);
  const scrollHechoRef = useRef<string | null>(null);
  const focoHechoRef = useRef<string | null>(null);
  const {
    data: exportacion,
    error,
    isLoading,
    refetch,
  } = useExportacion(exportacionId);

  const noEncontrado = isAxiosError(error) && error.response?.status === 404;
  const enProceso = exportacion ? !esEstadoFinal(exportacion.estado) : false;

  useEffect(() => {
    if (!autoEnfocar || scrollHechoRef.current === exportacionId) return;

    scrollHechoRef.current = exportacionId;
    contenedorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [autoEnfocar, exportacionId]);

  useEffect(() => {
    if (
      !autoEnfocar ||
      isLoading ||
      focoHechoRef.current === exportacionId ||
      !tituloRef.current
    ) {
      return;
    }

    focoHechoRef.current = exportacionId;
    tituloRef.current.focus({ preventScroll: true });
  }, [autoEnfocar, exportacionId, isLoading]);

  useEffect(() => {
    if (!exportacion || !enProceso) return;

    const creadoMs = Date.parse(exportacion.creado_en);
    if (!Number.isFinite(creadoMs)) return;

    const restante = Math.max(
      0,
      creadoMs + UMBRAL_CONSULTA_LENTA_MS - Date.now(),
    );
    const timer = setTimeout(() => {
      setTardoParaId(exportacion.id);
    }, restante);

    return () => clearTimeout(timer);
  }, [exportacion, enProceso]);

  if (isLoading) {
    return (
      <div ref={contenedorRef} className="scroll-mt-6">
        <Card size="sm" aria-busy>
          <CardContent className="space-y-3 py-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exportacion) {
    return (
      <div ref={contenedorRef} className="scroll-mt-6">
        <Card
          size="sm"
          className="border-destructive-border bg-destructive-soft/40"
        >
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle
                ref={tituloRef}
                tabIndex={-1}
                className="focus:outline-none"
              >
                {noEncontrado
                  ? "Ya no se puede consultar esta exportación."
                  : "No se pudo consultar la exportación"}
              </CardTitle>
            </div>
            <CerrarResultadoButton onCerrar={onCerrar} />
          </CardHeader>
          <CardContent className="space-y-3">
            {!noEncontrado && (
              <ErrorAlert error={error} onRetry={() => refetch()} />
            )}
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCerrar}
              >
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const errorPasajero = Boolean(error) && !noEncontrado;
  const finalizada = !enProceso;
  const tardaMasDeDosMinutos = tardoParaId === exportacion.id;
  const titulo = exportacion.periodo
    ? `${getTipoExportacionLabel(exportacion.tipo)} — ${formatPeriodo(exportacion.periodo)}`
    : getTipoExportacionLabel(exportacion.tipo);

  const errorMensaje = traducirErrorExportacion(
    exportacion.error ?? exportacion.resultado?.error,
  );
  const archivos = exportacion.resultado?.archivos ?? [];
  const correos = exportacion.resultado?.correos ?? [];

  return (
    <div ref={contenedorRef} className="scroll-mt-6 space-y-1.5">
      {errorPasajero && (
        <p role="status" className="text-xs text-muted-foreground">
          No pudimos actualizar el estado; seguimos intentando.
        </p>
      )}

      <Card size="sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <CardTitle
              ref={tituloRef}
              tabIndex={-1}
              className="focus:outline-none"
            >
              {titulo}
            </CardTitle>
            <EstadoExportacionBadge estado={exportacion.estado} />
          </div>
          <CerrarResultadoButton onCerrar={onCerrar} />
        </CardHeader>

        <CardContent className="space-y-4">
          {!finalizada && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <Spinner className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Preparando la exportación…
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Puede tardar hasta un minuto.
                  </p>
                </div>
              </div>

              {exportacion.requiere_revision ? (
                <Alert className="border-warning-border bg-warning-soft text-warning-soft-foreground">
                  <AlertTriangleIcon />
                  <AlertDescription className="text-warning-soft-foreground">
                    Está tardando más de lo normal. Avisa al administrador.
                  </AlertDescription>
                </Alert>
              ) : (
                tardaMasDeDosMinutos && (
                  <Alert className="border-warning-border bg-warning-soft text-warning-soft-foreground">
                    <AlertTriangleIcon />
                    <AlertDescription className="text-warning-soft-foreground">
                      Está tardando más de lo normal. Si no avanza en unos
                      minutos, avisa al administrador.
                    </AlertDescription>
                  </Alert>
                )
              )}
            </div>
          )}

          {exportacion.estado === "FALLIDO" && (
            <Alert variant="destructive">
              <AlertTriangleIcon />
              <AlertTitle>No se pudo generar la exportación</AlertTitle>
              <AlertDescription>
                {errorMensaje ??
                  "Ocurrió un problema al generar los archivos. Inténtalo de nuevo."}
              </AlertDescription>
            </Alert>
          )}

          {tieneArchivos(exportacion.estado) && (
            <div className="space-y-4">
              {exportacion.estado === "PARCIAL" && errorMensaje && (
                <Alert className="border-warning-border bg-warning-soft text-warning-soft-foreground">
                  <AlertTriangleIcon />
                  <AlertDescription className="text-warning-soft-foreground">
                    {errorMensaje}
                  </AlertDescription>
                </Alert>
              )}

              {exportacion.tipo === "BOLETAS" && correos.length > 0 && (
                <ExportacionCorreosResumen correos={correos} />
              )}

              <ExportacionArchivosTabla
                exportacionId={exportacion.id}
                archivos={archivos}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
