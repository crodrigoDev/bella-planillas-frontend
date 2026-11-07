import { useState } from "react";
import { useParams } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { BackLink } from "@/components/page/BackLink";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AlertaUrgenciaSolicitud } from "@/features/solicitudes/components/detalle/AlertaUrgenciaSolicitud";
import { ColaboradorSolicitudCard } from "@/features/solicitudes/components/detalle/ColaboradorSolicitudCard";
import { DatosSolicitud } from "@/features/solicitudes/components/detalle/DatosSolicitud";
import { HistorialSolicitud } from "@/features/solicitudes/components/detalle/HistorialSolicitud";
import { SolicitudCabecera } from "@/features/solicitudes/components/detalle/SolicitudCabecera";
import { SustentoSolicitud } from "@/features/solicitudes/components/detalle/SustentoSolicitud";
import { SolicitudModales } from "@/features/solicitudes/components/modals/SolicitudModales";
import { useSolicitud } from "@/features/solicitudes/hooks/useSolicitudes";
import type { AccionSolicitud } from "@/features/solicitudes/types/solicitudes.types";
import { getAccionesSolicitud } from "@/features/solicitudes/utils/solicitudes.utils";

/**
 * Detalle de una solicitud con sus acciones (tomar, aprobar, rechazar y anular)
 *
 * @remarks
 * Carga por id o por código. Quién puede aprobar o rechazar se decide con el
 * id del usuario de la sesión y el responsable de la solicitud. Al terminar
 * una acción, la consulta se refresca y la página muestra el nuevo estado.
 */
export default function SolicitudDetallePage() {
  const { id } = useParams();
  const { session } = useAuth();
  const [accion, setAccion] = useState<AccionSolicitud | null>(null);
  const {
    data: solicitud,
    isLoading,
    isError,
    error,
    refetch,
  } = useSolicitud(id);

  return (
    <section
      aria-labelledby="solicitud-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <BackLink to={ROUTE_PATHS.gestionPersonal.solicitudes}>
        Volver a Solicitudes
      </BackLink>

      {isLoading ? (
        <div className="space-y-6" aria-busy>
          <Skeleton className="h-14 w-80" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError ? (
        <ErrorAlert
          error={error}
          title="No se pudo cargar la solicitud"
          onRetry={() => refetch()}
        />
      ) : !solicitud ? (
        <div className="space-y-1 py-12 text-center">
          <h1 id="solicitud-title" className="text-xl font-semibold">
            No se encontró la solicitud
          </h1>
          <p className="text-sm text-muted-foreground">
            Puede que ya no exista o que el enlace no sea correcto.
          </p>
        </div>
      ) : (
        <>
          <SolicitudCabecera
            id="solicitud-title"
            solicitud={solicitud}
            acciones={getAccionesSolicitud(solicitud, session?.usuario.id)}
            onAccion={setAccion}
          />

          {solicitud.alerta_urgencia && (
            <AlertaUrgenciaSolicitud alerta={solicitud.alerta_urgencia} />
          )}

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <DatosSolicitud solicitud={solicitud} />
              <HistorialSolicitud solicitudId={solicitud.id} />
            </div>
            <div className="space-y-6">
              <ColaboradorSolicitudCard
                colaborador={solicitud.colaborador_resumen}
              />
              <SustentoSolicitud nombre={solicitud.sustento_nombre} />
            </div>
          </div>

          <SolicitudModales
            solicitud={solicitud}
            colaboradorNombre={solicitud.colaborador_resumen.nombre_completo}
            accion={accion}
            onClose={() => setAccion(null)}
          />
        </>
      )}
    </section>
  );
}
