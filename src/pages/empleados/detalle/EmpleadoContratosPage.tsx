import { useParams } from "react-router-dom";

import { EmpleadoDetalleContratos } from "@/features/empleados/components/detalle/EmpleadoDetalleContratos";

/**
 * Pestaña Contratos de la ficha
 */
export default function EmpleadoContratosPage() {
  const { id = "" } = useParams();

  return <EmpleadoDetalleContratos empleadoId={id} />;
}
