import { EmpleadoDetalleDerechohabientes } from "@/features/empleados/components/detalle/EmpleadoDetalleDerechohabientes";
import { useEmpleadoDetalleContext } from "@/features/empleados/hooks/useEmpleadoDetalleContext";

/**
 * Pestaña Derechohabientes de la ficha
 */
export default function EmpleadoDerechohabientesPage() {
  const { empleado } = useEmpleadoDetalleContext();

  return <EmpleadoDetalleDerechohabientes empleadoId={empleado.id} />;
}
