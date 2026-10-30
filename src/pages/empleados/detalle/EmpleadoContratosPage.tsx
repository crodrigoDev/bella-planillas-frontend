import { useParams } from "react-router-dom";

import { ContratosEmpleado } from "@/features/contratos/components/ContratosEmpleado";

/**
 * Pestaña Contratos de la ficha
 */
export default function EmpleadoContratosPage() {
  const { id = "" } = useParams();

  return <ContratosEmpleado empleadoId={id} />;
}
