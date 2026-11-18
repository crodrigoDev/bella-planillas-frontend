import { Link, useLocation, useParams } from "react-router-dom";

import { BackLink } from "@/components/page/BackLink";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActividadCabecera } from "@/features/auditoria/components/detalle/ActividadCabecera";
import { ContextoActividad } from "@/features/auditoria/components/detalle/ContextoActividad";
import { OtrosCambiosAfectado } from "@/features/auditoria/components/detalle/OtrosCambiosAfectado";
import { CambiosActividad } from "@/features/auditoria/components/cambios/CambiosActividad";
import { useAuditoriaRegistro } from "@/features/auditoria/hooks/useAuditoria";
import { getDestinoVolver } from "@/features/auditoria/utils/detalle.utils";
import { parseUuid } from "@/lib/urlParams.utils";

/**
 * Detalle de un registro de auditoría: qué pasó, qué cambió y a quién afectó
 *
 * @remarks
 * Una sola consulta (`GET actividad/:id`) trae el resumen, el contexto y los
 * cambios. El título es el resumen; los cambios ocupan la columna principal y
 * el contexto y los otros cambios del afectado van al lado (en pantallas
 * angostas, el contexto va primero). "Volver" lleva al listado con los filtros
 * con que se llegó, o a la pestaña Historial si se llegó de ahí. Un id que no
 * es uuid se trata como no encontrado.
 */
export default function AuditoriaDetallePage() {
  const params = useParams();
  const { state } = useLocation();
  const id = parseUuid(params.id ?? null);
  const volver = getDestinoVolver(state);
  const { data, error, isLoading, refetch } = useAuditoriaRegistro(id);

  return (
    <section
      aria-labelledby="auditoria-detalle-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <BackLink to={volver.to}>{volver.label}</BackLink>

      {isLoading ? (
        <div className="space-y-6" aria-busy>
          <Skeleton className="h-16 w-full max-w-3xl" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : error ? (
        <ErrorAlert
          error={error}
          title="No se pudo cargar el registro de auditoría"
          onRetry={() => refetch()}
        />
      ) : !data ? (
        <EmptyState
          title="No se encontró el registro"
          description="Puede que ya no exista, que el enlace no sea correcto o que tu rol no pueda verlo."
          action={
            <Button variant="outline" render={<Link to={volver.to} />}>
              {volver.label}
            </Button>
          }
        />
      ) : (
        <>
          <ActividadCabecera id="auditoria-detalle-title" fila={data} />

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="lg:col-start-2 lg:row-start-1">
              <ContextoActividad fila={data} />
            </div>

            <section
              aria-labelledby="cambios-actividad-title"
              className="space-y-3 lg:col-start-1 lg:row-span-2 lg:row-start-1"
            >
              <h2
                id="cambios-actividad-title"
                className="text-base font-semibold"
              >
                Qué cambió
              </h2>
              {data.cambios.length ? (
                <CambiosActividad
                  cambios={data.cambios}
                  accion={data.accion_etiqueta}
                />
              ) : (
                <EmptyState
                  variant="dashed"
                  title="No hay cambios que mostrar."
                  description="Esta fila no guardó valores distintos entre antes y después."
                />
              )}
            </section>

            <div className="lg:col-start-2 lg:row-start-2">
              <OtrosCambiosAfectado fila={data} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
