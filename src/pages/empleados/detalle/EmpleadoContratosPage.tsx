import { useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { ContratosEmpleado } from "@/features/contratos/components/ContratosEmpleado";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";

/**
 * Pestaña Contratos de la ficha
 *
 * @remarks
 * El layout ya cargó al empleado, así que `useEmpleado` lo devuelve de la
 * caché. Se necesita saber si está activo: no se renueva el contrato de un
 * empleado dado de baja.
 */
export default function EmpleadoContratosPage() {
  const { id = "" } = useParams();
  const { data: empleado } = useEmpleado(id);

  if (!empleado) return <Skeleton className="h-64 w-full" />;

  return (
    <ContratosEmpleado empleadoId={empleado.id} empleadoActivo={empleado.activo} />
  );
}
