import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmpleadoFormSection from "./EmpleadoFormSection";
import EmpleadoInputField from "./EmpleadoInputField";
import EmpleadoSelectField from "./EmpleadoSelectField";
import { ESTADOS_CONTRATO } from "../../config/ficha-empleado.config";
import type { ContratoFormMode } from "../../types/contrato-empleado.types";

/** Captura los campos compartidos del registro y la gestion del contrato */
export default function EmpleadoContrato({ mode = "crear" }: { mode?: ContratoFormMode }) {
  return (
    <EmpleadoFormSection title="Contrato del empleado" icon={FileText} description="* Campos obligatorios">
      <EmpleadoInputField
        name="contrato.tipo_modalidad"
        emptyValue={mode === "crear" ? undefined : ""}
        label="Modalidad del contrato"
        placeholder="Ej. PLAZO_FIJO o INDETERMINADO"
        maxLength={100}
      />
      <EmpleadoInputField name="contrato.fecha_inicio" emptyValue="" label="Fecha de inicio del contrato" type="date" required />
      <EmpleadoInputField name="contrato.fecha_fin" emptyValue={mode === "crear" ? undefined : null} label="Fecha de fin del contrato" type="date" />
      <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2 lg:col-span-3">
        La fecha de fin es opcional para contratos sin una fecha de término
      </p>
      <EmpleadoInputField
        name="contrato.observacion"
        emptyValue={mode === "editar" ? "" : mode === "renovar" ? null : undefined}
        label="Observaciones del contrato"
        maxLength={500}
        placeholder="Información adicional del contrato"
        className="sm:col-span-2 lg:col-span-3"
      />
      {mode === "editar" ? (
        <EmpleadoSelectField name="contrato.estado" label="Estado del contrato" options={Object.entries(ESTADOS_CONTRATO).map(([value, state]) => ({ value, label: state.label }))} />
      ) : <div className="space-y-2 text-xs"><p className="font-medium text-foreground">Estado inicial del contrato</p><Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Vigente</Badge></div>}
    </EmpleadoFormSection>
  );
}
