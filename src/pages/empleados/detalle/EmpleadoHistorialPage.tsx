import { useParams } from "react-router-dom";

import { HistorialEmpleado } from "@/features/historial/components/HistorialEmpleado";

/**
 * Pestaña Historial de la ficha
 *
 * @remarks
 * Consulta la auditoría del empleado con el id de la ficha.
 */
export default function EmpleadoHistorialPage() {
  const { id = "" } = useParams();

  return <HistorialEmpleado empleadoId={id} />;
}
