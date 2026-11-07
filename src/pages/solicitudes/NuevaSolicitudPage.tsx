import { useState } from "react";

import { ROUTE_PATHS } from "@/app/routes/path";
import { BackLink } from "@/components/page/BackLink";
import { PageHeader } from "@/components/page/PageHeader";
import { useEmpleadosActivos } from "@/features/empleados/hooks/useCatalogos";
import { SolicitudForm } from "@/features/solicitudes/components/formulario/SolicitudForm";
import type { ColaboradorOption } from "@/lib/types/options.types";

const NO_EMPLEADOS: ColaboradorOption[] = [];

/**
 * Registro de una solicitud a nombre de un colaborador
 *
 * @remarks
 * La búsqueda de colaboradores activos la hace esta página y se pasa por
 * props, porque solicitudes no importa de empleados.
 */
export default function NuevaSolicitudPage() {
  const [busqueda, setBusqueda] = useState("");
  const empleados = useEmpleadosActivos(busqueda);

  return (
    <section
      aria-labelledby="nueva-solicitud-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <BackLink to={ROUTE_PATHS.gestionPersonal.solicitudes}>
        Volver a Solicitudes
      </BackLink>

      <PageHeader
        id="nueva-solicitud-title"
        title="Nueva solicitud"
        description="Registra una solicitud a nombre de un colaborador activo."
      />

      <SolicitudForm
        empleados={empleados.data ?? NO_EMPLEADOS}
        empleadosLoading={empleados.isFetching}
        onEmpleadoSearchChange={setBusqueda}
      />
    </section>
  );
}
