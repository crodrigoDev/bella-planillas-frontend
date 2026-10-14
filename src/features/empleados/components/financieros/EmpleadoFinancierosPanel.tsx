import { Banknote, HeartPulse, Landmark, Pencil, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REGIMENES_SALUD } from "../../config/empleados.config";
import { TIPO_CUENTA_OPTIONS } from "../../config/crear-empleado.config";
import { formatEmpleadoSueldo } from "../../utils/empleados.utils";
import type { FinancieroEmpleado } from "../../types/financiero-empleado.types";
import FichaInformacionSection from "../ficha/FichaInformacionSection";
import FichaEmptyState from "../ficha/FichaEmptyState";

interface EmpleadoFinancierosPanelProps {
  financiero: FinancieroEmpleado | null;
  canCreate: boolean;
  canEdit: boolean;
  onManage: () => void;
}

/** Presenta la ficha financiera con las cuentas y CUSPP enmascarados */
export default function EmpleadoFinancierosPanel({ financiero, canCreate, canEdit, onManage }: EmpleadoFinancierosPanelProps) {
  return (
    <section className="space-y-4 xl:col-span-2" aria-labelledby="financieros-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="financieros-title" className="flex items-center gap-2 text-sm font-semibold"><Banknote aria-hidden="true" className="size-4 text-primary" />Datos financieros</h2>
        {((financiero && canEdit) || (!financiero && canCreate)) && <Button type="button" variant="outline" size="sm" onClick={onManage}>{financiero ? <Pencil aria-hidden="true" /> : <Plus aria-hidden="true" />}{financiero ? "Editar datos financieros" : "Registrar datos financieros"}</Button>}
      </div>
      {!financiero ? <FichaEmptyState icon={Banknote} title="Sin datos financieros" description="El empleado todavía no tiene una ficha financiera registrada" /> : (
        <div className="grid items-start gap-5 xl:grid-cols-2">
          <FichaInformacionSection title="Remuneración y pensión" icon={Banknote} items={[
            { label: "Sueldo básico", value: formatEmpleadoSueldo(financiero.sueldo_basico) },
            { label: "Régimen de pensión", value: financiero.regimen_nombre },
            { label: "AFP", value: financiero.afp_nombre },
            { label: "CUSPP", value: financiero.cuspp },
            { label: "Tipo de comisión", value: financiero.tipo_comision === "MIXTA" ? "Mixta" : financiero.tipo_comision === "FLUJO" ? "Flujo" : null },
          ]} />
          <FichaInformacionSection title="Cobertura de salud" icon={HeartPulse} items={[
            { label: "Régimen de salud", value: REGIMENES_SALUD[financiero.regimen_salud] },
            { label: "EPS", value: financiero.eps_nombre },
            { label: "Plan", value: financiero.eps_plan },
            { label: "Costo adicional EPS", value: formatEmpleadoSueldo(financiero.eps_costo_adicional) },
          ]} />
          <FichaInformacionSection title="Cuenta de sueldo" icon={Landmark} items={[
            { label: "Banco", value: financiero.banco_sueldo_nombre },
            { label: "Tipo de cuenta", value: TIPO_CUENTA_OPTIONS.find((item) => item.value === financiero.tipo_cuenta_sueldo)?.label },
            { label: "Número de cuenta", value: financiero.nro_cuenta_sueldo },
            { label: "CCI", value: financiero.cci_sueldo },
          ]} />
          <FichaInformacionSection title="Cuenta de CTS" icon={Wallet} items={[
            { label: "Banco", value: financiero.banco_cts_nombre },
            { label: "Tipo de cuenta", value: TIPO_CUENTA_OPTIONS.find((item) => item.value === financiero.tipo_cuenta_cts)?.label },
            { label: "Número de cuenta", value: financiero.nro_cuenta_cts },
            { label: "CCI", value: financiero.cci_cts },
          ]} />
        </div>
      )}
    </section>
  );
}
