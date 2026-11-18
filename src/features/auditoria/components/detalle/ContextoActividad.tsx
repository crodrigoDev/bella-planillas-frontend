import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { buildEmpleadoPath, buildSolicitudPath } from "@/app/routes/path";
import { ResumenCampo } from "@/components/form/ResumenCampo";
import { MODULO_SOLICITUD } from "../../config/auditoria.config";
import type { FilaActividad } from "../../types/auditoria.types";

interface ContextoActividadProps {
  fila: FilaActividad;
}

/**
 * Contexto de un cambio: a quién afectó, quién lo hizo y en qué módulo
 *
 * @remarks
 * Un colaborador afectado enlaza a su ficha y una solicitud, a su detalle. La
 * empresa y los demás afectados se muestran sin enlace. Sin autor, lo hizo el
 * sistema.
 */
export function ContextoActividad({ fila }: ContextoActividadProps) {
  const { afectado, actor } = fila;

  return (
    <section
      aria-labelledby="contexto-actividad-title"
      className="space-y-4 rounded-lg border bg-card p-4"
    >
      <h2 id="contexto-actividad-title" className="text-base font-semibold">
        Contexto
      </h2>

      <div className="space-y-4">
        <Dato label="Afectado">
          {afectado ? (
            <>
              {afectado.tipo === "empleado" && afectado.id ? (
                <Link
                  to={buildEmpleadoPath(afectado.id)}
                  className="text-primary hover:underline"
                >
                  {afectado.nombre}
                </Link>
              ) : (
                afectado.nombre
              )}
              {afectado.detalle && (
                <span className="block text-sm font-normal text-muted-foreground">
                  {afectado.detalle}
                </span>
              )}
            </>
          ) : (
            "--"
          )}
        </Dato>

        <Dato label="Hecho por">
          {actor ? (
            <>
              {actor.nombre}
              <span className="block text-sm font-normal text-muted-foreground">
                {actor.rol}
              </span>
            </>
          ) : (
            "Sistema"
          )}
        </Dato>

        <ResumenCampo label="Módulo" value={fila.modulo_etiqueta} />

        {fila.modulo === MODULO_SOLICITUD && (
          <Dato label="Registro">
            <Link
              to={buildSolicitudPath(fila.registro_id)}
              className="text-primary hover:underline"
            >
              Ver la solicitud
            </Link>
          </Dato>
        )}
      </div>
    </section>
  );
}

interface DatoProps {
  label: string;
  children: ReactNode;
}

/** Un dato de contexto con el mismo aspecto que `ResumenCampo`, pero con contenido libre */
function Dato({ label, children }: DatoProps) {
  return (
    <dl className="space-y-0.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium wrap-break-word">{children}</dd>
    </dl>
  );
}
