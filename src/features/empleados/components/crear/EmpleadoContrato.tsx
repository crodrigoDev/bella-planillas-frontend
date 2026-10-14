import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmpleadoFormSection from "../form/EmpleadoFormSection";
import EmpleadoInputField from "../form/EmpleadoInputField";

/** Captura los datos del primer contrato del empleado */
export default function EmpleadoContrato() {
  return (
    <EmpleadoFormSection title="Contrato del empleado" icon={FileText} description="* Campos obligatorios">
      <EmpleadoInputField
        name="contrato.tipo_modalidad"
        label="Modalidad del contrato"
        placeholder="Ej. PLAZO_FIJO o INDETERMINADO"
        maxLength={100}
      />
      <EmpleadoInputField name="contrato.fecha_inicio" label="Fecha de inicio del contrato" type="date" required />
      <EmpleadoInputField name="contrato.fecha_fin" label="Fecha de fin del contrato" type="date" />
      <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2 lg:col-span-3">
        La fecha de fin es opcional para contratos sin una fecha de término
      </p>
      <EmpleadoInputField
        name="contrato.observacion"
        label="Observaciones del contrato"
        maxLength={500}
        placeholder="Información adicional del contrato"
        className="sm:col-span-2 lg:col-span-3"
      />
      <div className="space-y-2 text-xs">
        <p className="font-medium text-foreground">Estado inicial del contrato</p>
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Vigente</Badge>
      </div>
    </EmpleadoFormSection>
  );
}
