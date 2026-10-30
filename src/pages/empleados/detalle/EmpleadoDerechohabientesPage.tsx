import { useParams } from "react-router-dom";

import { DerechohabientesEmpleado } from "@/features/derechohabientes/components/DerechohabientesEmpleado";

/**
 * Pestaña Derechohabientes de la ficha
 */
export default function EmpleadoDerechohabientesPage() {
  const { id = "" } = useParams();

  return <DerechohabientesEmpleado empleadoId={id} />;
}
