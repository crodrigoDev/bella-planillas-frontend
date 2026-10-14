import { FileText } from "lucide-react";
import type { ContratoEmpleado } from "../../types/ficha-empleado.types";
import EmpleadoContratoCard from "./EmpleadoContratoCard";
import FichaEmptyState from "./FichaEmptyState";

interface EmpleadoContratosTabProps {
  contratos: ContratoEmpleado[];
  available: boolean;
}

/** Muestra el historial de contratos del empleado */
export default function EmpleadoContratosTab({ contratos, available }: EmpleadoContratosTabProps) {
  if (!available) return <FichaEmptyState icon={FileText} title="Contratos no disponibles" description="La consulta de contratos no está disponible para empleados dados de baja" />;
  if (!contratos.length) return <FichaEmptyState icon={FileText} title="Sin contratos registrados" description="Este empleado todavía no tiene contratos asociados" />;
  return (
    <div className="space-y-4">
      <div><h2 className="text-sm font-semibold">Historial de contratos</h2><p className="mt-1 text-xs text-muted-foreground">Ordenados desde el contrato más reciente</p></div>
      {contratos.map((contrato) => <EmpleadoContratoCard key={contrato.id} contrato={contrato} />)}
    </div>
  );
}
