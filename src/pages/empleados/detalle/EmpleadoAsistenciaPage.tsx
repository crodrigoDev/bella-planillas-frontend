import { useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { AsistenciaEmpleado } from "@/features/asistencia/components/AsistenciaEmpleado";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";
import { formatJornada } from "@/features/empleados/utils/empleados.utils";

/**
 * Pestaña Asistencia de la ficha
 *
 * @remarks
 * El layout ya cargó al empleado, así que `useEmpleado` lo devuelve de la
 * caché. Las marcaciones manuales necesitan su documento y la jornada se
 * elige del catálogo de `empleados`.
 */
export default function EmpleadoAsistenciaPage() {
  const { id = "" } = useParams();
  const { data: empleado } = useEmpleado(id);
  const { jornadas } = useEmpleadosCatalogos();

  if (!empleado) return <Skeleton className="h-64 w-full" />;

  return (
    <AsistenciaEmpleado
      empleadoId={empleado.id}
      nroDocumento={empleado.nro_documento}
      fechaInicioLabores={empleado.fecha_inicio}
      jornadaActual={formatJornada(empleado.jornada)}
      jornadas={jornadas.data}
      isLoadingJornadas={jornadas.isLoading}
    />
  );
}
