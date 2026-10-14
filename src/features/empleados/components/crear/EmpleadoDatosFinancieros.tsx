import { Banknote, HeartPulse, Landmark, Wallet } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { AFPS_MOCK, BANCOS_MOCK, REGIMENES_PENSION_MOCK } from "../../data/registro-empleado.mock";
import { COMISION_AFP_OPTIONS, SALUD_OPTIONS, TIPO_CUENTA_OPTIONS } from "../../config/crear-empleado.config";
import type { CrearEmpleadoFormValues } from "../../types/crear-empleado.types";
import EmpleadoFormSection from "./EmpleadoFormSection";
import EmpleadoInputField from "./EmpleadoInputField";
import EmpleadoSelectField from "./EmpleadoSelectField";

/** Captura pension, sueldo, cuentas bancarias y cobertura de salud */
export default function EmpleadoDatosFinancieros() {
  const { control, setValue } = useFormContext<CrearEmpleadoFormValues>();
  const regimenId = useWatch({ control, name: "financiero.id_regimen" });
  const salud = useWatch({ control, name: "financiero.regimen_salud" });
  const regimen = REGIMENES_PENSION_MOCK.find((item) => item.id === regimenId);
  const afps = AFPS_MOCK.filter((item) => item.id_regimen === regimenId);
  const usaEps = salud === "EPS" || salud === "ESSALUD_Y_EPS";
  const bancos = BANCOS_MOCK.map((item) => ({ value: item.id, label: item.nombre }));

  return (
    <div className="space-y-5">
      <EmpleadoFormSection title="Remuneración y pensión" icon={Banknote} description="* Campos obligatorios">
        <EmpleadoInputField name="financiero.sueldo_basico" label="Sueldo básico (S/)" type="number" min={0} max={999999.9999} step="0.0001" placeholder="Ej. 2500.00" required />
        <EmpleadoSelectField
          name="financiero.id_regimen"
          label="Régimen de pensión"
          options={REGIMENES_PENSION_MOCK.map((item) => ({ value: item.id, label: item.nombre }))}
          required
          onValueChange={() => {
            // Al cambiar de regimen limpia la AFP elegida y sus datos
            setValue("financiero.id_tipo_afp", null, { shouldDirty: true });
            setValue("financiero.cuspp", null, { shouldDirty: true });
            setValue("financiero.tipo_comision", null, { shouldDirty: true });
          }}
        />
        {regimen?.nombre === "AFP" && (
          <>
            <EmpleadoSelectField name="financiero.id_tipo_afp" label="AFP" options={afps.map((item) => ({ value: item.id, label: item.nombre }))} emptyLabel="Sin especificar" />
            <EmpleadoInputField name="financiero.cuspp" label="CUSPP" maxLength={12} placeholder="12 caracteres alfanuméricos" />
            <EmpleadoSelectField name="financiero.tipo_comision" label="Tipo de comisión AFP" options={COMISION_AFP_OPTIONS} emptyLabel="Sin especificar" />
          </>
        )}
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Cuenta de abono de sueldo" icon={Landmark} description="Datos bancarios opcionales">
        <EmpleadoSelectField name="financiero.id_banco_sueldo" label="Banco de sueldo" options={bancos} emptyLabel="Sin banco asignado" />
        <EmpleadoSelectField name="financiero.tipo_cuenta_sueldo" label="Tipo de cuenta de sueldo" options={TIPO_CUENTA_OPTIONS} />
        <EmpleadoInputField name="financiero.nro_cuenta_sueldo" label="Número de cuenta de sueldo" inputMode="numeric" maxLength={30} />
        <EmpleadoInputField name="financiero.cci_sueldo" label="CCI de sueldo" inputMode="numeric" maxLength={30} />
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Cuenta de depósito de CTS" icon={Wallet} description="Datos bancarios opcionales">
        <EmpleadoSelectField name="financiero.id_banco_cts" label="Banco de CTS" options={bancos} emptyLabel="Sin banco asignado" />
        <EmpleadoSelectField name="financiero.tipo_cuenta_cts" label="Tipo de cuenta de CTS" options={TIPO_CUENTA_OPTIONS} />
        <EmpleadoInputField name="financiero.nro_cuenta_cts" label="Número de cuenta de CTS" inputMode="numeric" maxLength={30} />
        <EmpleadoInputField name="financiero.cci_cts" label="CCI de CTS" inputMode="numeric" maxLength={30} />
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Cobertura de salud" icon={HeartPulse}>
        <EmpleadoSelectField
          name="financiero.regimen_salud"
          label="Régimen de salud"
          options={SALUD_OPTIONS}
          onValueChange={(value) => {
            if (value === "EPS" || value === "ESSALUD_Y_EPS") return;
            // No conserva datos de EPS cuando se elige otra cobertura
            setValue("financiero.eps_nombre", null, { shouldDirty: true });
            setValue("financiero.eps_plan", null, { shouldDirty: true });
            setValue("financiero.eps_costo_adicional", 0, { shouldDirty: true });
          }}
        />
        {usaEps && (
          <>
            <EmpleadoInputField name="financiero.eps_nombre" label="Nombre de la EPS" maxLength={100} />
            <EmpleadoInputField name="financiero.eps_plan" label="Plan de EPS" maxLength={100} />
            <EmpleadoInputField name="financiero.eps_costo_adicional" label="Costo adicional de EPS (S/)" type="number" min={0} step="0.01" />
          </>
        )}
      </EmpleadoFormSection>
    </div>
  );
}
