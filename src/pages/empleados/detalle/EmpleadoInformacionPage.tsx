import { useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { DatosFinancierosEmpleado } from "@/features/datosFinancieros/components/DatosFinancierosEmpleado";
import { EmpleadoDetalleDatos } from "@/features/empleados/components/detalle/EmpleadoDetalleDatos";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";

/**
 * Pestaña Información de la ficha: datos del empleado y sus datos financieros
 *
 * @remarks
 * El layout ya cargó al empleado, así que `useEmpleado` lo devuelve de la
 * caché. La guarda de `empleado` solo satisface al tipo.
 */
export default function EmpleadoInformacionPage() {
  const { id } = useParams();
  const { data: empleado } = useEmpleado(id);

  if (!empleado) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <EmpleadoDetalleDatos empleado={empleado} />
      <DatosFinancierosEmpleado empleadoId={empleado.id} />
    </div>
  );
}
