import { FileText, Plus } from "lucide-react";
import type { ContratoEmpleado } from "../../types/ficha-empleado.types";
import EmpleadoContratoCard from "./EmpleadoContratoCard";
import FichaEmptyState from "./FichaEmptyState";
import { Button } from "@/components/ui/button";
import type { ContratoActions } from "../../types/contrato-empleado.types";

interface EmpleadoContratosTabProps extends ContratoActions {
  contratos: ContratoEmpleado[];
  available: boolean;
  canManage: boolean;
  onCreate: () => void;
}

/** Muestra el historial de contratos del empleado */
export default function EmpleadoContratosTab({ contratos, available, canManage, onCreate, onEdit, onRenew, onCancel }: EmpleadoContratosTabProps) {
  if (!available) return <FichaEmptyState icon={FileText} title="Contratos no disponibles" description="La consulta de contratos no está disponible para empleados dados de baja" />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold">Historial de contratos</h2><p className="mt-1 text-xs text-muted-foreground">Ordenados desde el contrato más reciente</p></div>{canManage && <Button type="button" size="sm" onClick={onCreate}><Plus aria-hidden="true" />Nuevo contrato</Button>}</div>
      {!contratos.length ? <FichaEmptyState icon={FileText} title="Sin contratos registrados" description="Este empleado todavía no tiene contratos asociados" /> : contratos.map((contrato) => <EmpleadoContratoCard key={contrato.id} contrato={contrato} canManage={canManage} onEdit={onEdit} onRenew={onRenew} onCancel={onCancel} />)}
    </div>
  );
}
