import { Link } from "react-router-dom";

import { buildEmpleadoPath } from "@/app/routes/path";
import { ResumenCampo } from "@/components/form/ResumenCampo";
import type { ColaboradorResumen } from "../../types/solicitudes.types";

interface ColaboradorSolicitudCardProps {
  colaborador: ColaboradorResumen;
}

/**
 * Tarjeta con los datos del colaborador que hizo la solicitud
 *
 * @remarks
 * La antigüedad la calcula el backend. El nombre lleva a la ficha del colaborador.
 */
export function ColaboradorSolicitudCard({
  colaborador,
}: ColaboradorSolicitudCardProps) {
  return (
    <section
      aria-labelledby="colaborador-solicitud-title"
      className="space-y-4 rounded-lg border bg-card p-4"
    >
      <h2 id="colaborador-solicitud-title" className="text-base font-semibold">
        Colaborador
      </h2>

      <div className="space-y-1">
        <Link
          to={buildEmpleadoPath(colaborador.id)}
          className="text-sm font-medium text-primary hover:underline"
        >
          {colaborador.nombre_completo}
        </Link>
        <p className="text-sm text-muted-foreground">{colaborador.documento}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <ResumenCampo label="Área" value={colaborador.area} />
        <ResumenCampo label="Cargo" value={colaborador.cargo} />
        <ResumenCampo label="Antigüedad" value={colaborador.antiguedad} />
      </div>
    </section>
  );
}
