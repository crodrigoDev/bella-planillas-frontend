import { useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { DerechohabientesEmpleado } from "@/features/derechohabientes/components/DerechohabientesEmpleado";
import { useTiposDocumento } from "@/features/empleados/hooks/useCatalogos";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";

/**
 * Pestaña Derechohabientes de la ficha
 *
 * @remarks
 * El layout ya cargó al empleado, así que `useEmpleado` lo devuelve de la
 * caché. Se necesita saber si está activo (no se registran familiares de un
 * empleado dado de baja) y los tipos de documento, que son de `empleados`.
 */
export default function EmpleadoDerechohabientesPage() {
  const { id = "" } = useParams();
  const { data: empleado } = useEmpleado(id);
  const tiposDocumento = useTiposDocumento();

  if (!empleado) return <Skeleton className="h-64 w-full" />;

  return (
    <DerechohabientesEmpleado
      empleadoId={empleado.id}
      empleadoActivo={empleado.activo}
      tiposDocumento={tiposDocumento.data}
      isLoadingTiposDocumento={tiposDocumento.isLoading}
    />
  );
}
