import { useFormContext, useWatch } from "react-hook-form";

import { FormSection } from "@/components/form/FormSection";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { maskEnd } from "@/lib/format.utils";
import type { SelectOption } from "@/lib/types/options.types";
import {
  REGIMEN_PENSION_LABELS,
  REGIMEN_SALUD_OPTIONS,
  REGIMENES_SALUD_CON_EPS,
  TIPO_COMISION_OPTIONS,
  isRegimenAfp,
} from "../config/datosFinancieros.config";
import { useDatosFinancierosCatalogos } from "../hooks/useCatalogos";
import type { DatosFinancieros } from "../types/datosFinancieros.types";
import { CuentaBancariaCampos } from "./CuentaBancariaCampos";

interface DatosFinancierosCamposProps {
  /** El registro pide también la fecha de filiación a la AFP, que se guarda en el empleado */
  incluirFiliacion?: boolean;
  /**
   * Datos ya guardados (edición). El backend solo los devuelve enmascarados:
   * se muestran como ayuda y el campo se deja vacío para no cambiarlos.
   */
  guardados?: DatosFinancieros | null;
}

const getAyuda = (valor: string | null | undefined): string | undefined =>
  valor ? `${maskEnd(valor)} · vacío para no cambiarlo` : undefined;

/**
 * Secciones con la previsión social, el sueldo, las cuentas y el régimen de salud
 *
 * @remarks
 * Las usan el registro y la ficha. Deben estar dentro de un `FormProvider`
 * cuyo formulario tenga los nombres de campo de `CrearDatoFinancieroSchema`.
 * Los campos de la AFP y de la EPS solo aparecen cuando el régimen elegido
 * los necesita.
 */
export function DatosFinancierosCampos({
  incluirFiliacion = false,
  guardados,
}: DatosFinancierosCamposProps) {
  const { control } = useFormContext();
  const { regimenes, afps, bancos } = useDatosFinancierosCatalogos();

  const idRegimen = useWatch({ control, name: "id_regimen" });
  const regimenSalud = useWatch({ control, name: "regimen_salud" });

  const esAfp = isRegimenAfp(regimenes.data, idRegimen);
  const conEps = REGIMENES_SALUD_CON_EPS.includes(regimenSalud ?? "");

  const regimenOptions: SelectOption[] = (regimenes.data ?? []).map(
    ({ id, nombre }) => ({
      value: id,
      label: REGIMEN_PENSION_LABELS[nombre] ?? nombre,
    }),
  );

  return (
    <>
      <FormSection
        title="Previsión social y régimen de pensiones"
        description="Afiliación al Sistema Privado de Pensiones (AFP) o al Sistema Nacional de Pensiones (ONP)."
      >
        <SelectField
          name="id_regimen"
          label="Régimen previsional"
          required
          options={regimenOptions}
          placeholder="Selecciona un régimen"
          isLoading={regimenes.isLoading}
          fieldClassName="sm:col-span-2"
        />

        {esAfp && (
          <>
            <SelectField
              name="id_tipo_afp"
              label="AFP administradora"
              required
              options={afps.data}
              placeholder="Selecciona una AFP"
              isLoading={afps.isLoading}
            />
            <TextField
              name="cuspp"
              label="Código CUSPP"
              required={!guardados?.cuspp}
              optional
              maxLength={12}
              placeholder={getAyuda(guardados?.cuspp) ?? "12 caracteres"}
              className="uppercase"
            />
            <SelectField
              name="tipo_comision"
              label="Tipo de comisión"
              required
              options={TIPO_COMISION_OPTIONS}
              placeholder="Selecciona una comisión"
            />
            {incluirFiliacion && (
              <TextField
                name="afp_fecha_filiacion"
                label="Fecha de filiación a la AFP"
                required
                optional
                type="date"
              />
            )}
          </>
        )}
      </FormSection>

      <FormSection
        title="Remuneración"
        description="Sueldo básico mensual pactado, en soles."
      >
        <TextField
          name="sueldo_basico"
          label="Sueldo básico mensual (S/)"
          required
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
        />
      </FormSection>

      <FormSection
        title="Cuenta bancaria de haberes"
        description="Cuenta donde se deposita el sueldo mensual o quincenal."
      >
        <CuentaBancariaCampos
          cuenta="sueldo"
          bancoLabel="Banco de abono"
          sinBancoLabel="Sin cuenta bancaria"
          bancos={bancos.data}
          isLoadingBancos={bancos.isLoading}
          nroPlaceholder={getAyuda(guardados?.nro_cuenta_sueldo)}
          cciPlaceholder={getAyuda(guardados?.cci_sueldo)}
        />
      </FormSection>

      <FormSection
        title="Cuenta de CTS"
        description="Entidad que recibe los depósitos semestrales de la compensación por tiempo de servicios."
      >
        <CuentaBancariaCampos
          cuenta="cts"
          bancoLabel="Entidad financiera"
          sinBancoLabel="Sin cuenta de CTS"
          bancos={bancos.data}
          isLoadingBancos={bancos.isLoading}
          nroPlaceholder={getAyuda(guardados?.nro_cuenta_cts)}
          cciPlaceholder={getAyuda(guardados?.cci_cts)}
        />
      </FormSection>

      <FormSection
        title="Régimen de salud"
        description="Prestaciones de salud obligatorias y planes de salud complementarios."
      >
        <SelectField
          name="regimen_salud"
          label="Régimen de salud"
          options={REGIMEN_SALUD_OPTIONS}
          placeholder="Selecciona un régimen"
          fieldClassName="sm:col-span-2"
        />

        {conEps && (
          <>
            <TextField name="eps_nombre" label="Entidad EPS" optional />
            <TextField name="eps_plan" label="Plan contratado" optional />
            <TextField
              name="eps_costo_adicional"
              label="Copago mensual del colaborador (S/)"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
            />
          </>
        )}
      </FormSection>
    </>
  );
}
