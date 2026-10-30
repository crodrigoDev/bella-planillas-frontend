import { EmpleadoDetalleDatos } from "@/features/empleados/components/detalle/EmpleadoDetalleDatos";
import { EmpleadoDetalleFinancieros } from "@/features/empleados/components/detalle/EmpleadoDetalleFinancieros";
import { useEmpleadoDetalleContext } from "@/features/empleados/hooks/useEmpleadoDetalleContext";

/**
 * Pestaña Información de la ficha: datos del empleado y sus datos financieros
 */
export default function EmpleadoInformacionPage() {
  const { empleado } = useEmpleadoDetalleContext();

  return (
    <div className="space-y-6">
      <EmpleadoDetalleDatos empleado={empleado} />
      <EmpleadoDetalleFinancieros empleadoId={empleado.id} />
    </div>
  );
}
