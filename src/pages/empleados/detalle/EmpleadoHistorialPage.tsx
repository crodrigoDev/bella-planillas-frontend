import { useParams } from "react-router-dom";

import { HistorialEmpleado } from "@/features/auditoria/components/historial/HistorialEmpleado";

/**
 * Pestaña Historial de la ficha
 *
 * @remarks
 * Muestra la línea de tiempo de la auditoría del colaborador con el id de la ficha.
 */
export default function EmpleadoHistorialPage() {
  const { id = "" } = useParams();

  return <HistorialEmpleado empleadoId={id} />;
}
