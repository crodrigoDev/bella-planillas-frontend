import { useParams } from "react-router-dom";

import { EmpleadoDetalleDerechohabientes } from "@/features/empleados/components/detalle/EmpleadoDetalleDerechohabientes";

/**
 * Pestaña Derechohabientes de la ficha
 */
export default function EmpleadoDerechohabientesPage() {
  const { id = "" } = useParams();

  return <EmpleadoDetalleDerechohabientes empleadoId={id} />;
}
