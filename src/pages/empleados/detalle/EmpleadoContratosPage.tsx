import { EmpleadoDetalleContratos } from "@/features/empleados/components/detalle/EmpleadoDetalleContratos";
import { useEmpleadoDetalleContext } from "@/features/empleados/hooks/useEmpleadoDetalleContext";

/**
 * Pestaña Contratos de la ficha
 */
export default function EmpleadoContratosPage() {
  const { empleado } = useEmpleadoDetalleContext();

  return <EmpleadoDetalleContratos empleadoId={empleado.id} />;
}
