import { HistorialEmpleado } from "@/features/historial/components/HistorialEmpleado";
import { HISTORIAL_EMPLEADO_MOCK } from "@/features/historial/data/historial.mock";

/**
 * Pestaña Historial de la ficha
 *
 * @remarks
 * TEMPORAL: usa datos de ejemplo. Cuando el backend entregue el historial por
 * empleado, aquí se consulta con el id de la ficha.
 */
export default function EmpleadoHistorialPage() {
  return <HistorialEmpleado eventos={HISTORIAL_EMPLEADO_MOCK} />;
}
