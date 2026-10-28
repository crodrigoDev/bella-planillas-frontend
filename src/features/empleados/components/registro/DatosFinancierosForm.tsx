import { useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormSection } from "@/components/form/FormSection";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import type { SelectOption } from "@/lib/types/options.types";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  REGIMEN_PENSION_LABELS,
  REGIMEN_SALUD_OPTIONS,
  REGIMENES_SALUD_CON_EPS,
  TIPO_COMISION_OPTIONS,
  esRegimenAfp,
} from "../../config/empleados.config";
import { useDatosFinancierosCatalogos } from "../../hooks/useCatalogos";
import {
  createDatosFinancierosSchema,
  type DatosFinancierosDraft,
} from "../../schemas/datosFinancieros.schema";
import type { RegimenPension } from "../../types/empleados.types";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";
import { RegistroFooter } from "./RegistroFooter";
import { CuentaBancariaFields } from "./CuentaBancariaFields";

// Valores con los que empiezan los datos financieros de un empleado nuevo
const INITIAL_VALUES = {
  tipo_cuenta_sueldo: "SUELDO",
  tipo_cuenta_cts: "AHORROS",
  regimen_salud: "ESSALUD_REGULAR",
  eps_costo_adicional: 0,
} as const;

// Indica si el régimen elegido es el de las AFP según el catálogo
const isRegimenAfp = (
  regimenes: RegimenPension[] | undefined,
  idRegimen: string | undefined,
) => esRegimenAfp(regimenes?.find((r) => r.id === idRegimen)?.nombre);

const createResolver = (esRegimenAfp: (idRegimen: string) => boolean) =>
  zodResolver(createDatosFinancierosSchema(esRegimenAfp), zodResolverOptions);

// Valores del formulario antes de validar: los campos con valor por defecto
// del contrato todavía son opcionales. Se indican a `useForm` de forma
// explícita para que no los deduzca de `INITIAL_VALUES`.
type DatosFinancierosFormValues = Parameters<
  ReturnType<typeof createResolver>
>[0];

/**
 * Paso 2 del registro: previsión social, sueldo, cuentas y régimen de salud
 *
 * @remarks
 * Valida con el esquema de shared contracts y guarda los datos en el
 * borrador del asistente. Los campos de la AFP y de la EPS solo aparecen
 * cuando el régimen elegido los necesita.
 */
export function DatosFinancierosForm() {
  const datosFinancieros = useNuevoEmpleadoStore(
    (state) => state.datosFinancieros,
  );
  const saveDatosFinancieros = useNuevoEmpleadoStore(
    (state) => state.saveDatosFinancieros,
  );
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);

  const { regimenes, afps, bancos } = useDatosFinancierosCatalogos();

  const regimenesData = regimenes.data;

  // El esquema necesita saber qué régimen es el de las AFP, y eso lo dice el catálogo
  const resolver = useMemo(
    () => createResolver((idRegimen) => isRegimenAfp(regimenesData, idRegimen)),
    [regimenesData],
  );

  const methods = useForm<
    DatosFinancierosFormValues,
    unknown,
    DatosFinancierosDraft
  >({
    resolver,
    // Si el usuario vuelve a este paso, recupera lo que ya había escrito
    defaultValues: datosFinancieros ?? INITIAL_VALUES,
    // Los campos que se ocultan (AFP o EPS) dejan de validarse y de enviarse
    shouldUnregister: true,
  });
  const { control, handleSubmit } = methods;

  const idRegimen = useWatch({ control, name: "id_regimen" });
  const regimenSalud = useWatch({ control, name: "regimen_salud" });

  const esAfp = isRegimenAfp(regimenesData, idRegimen);
  const conEps = REGIMENES_SALUD_CON_EPS.includes(regimenSalud ?? "");

  const regimenOptions: SelectOption[] = (regimenesData ?? []).map(
    ({ id, nombre }) => ({
      value: id,
      label: REGIMEN_PENSION_LABELS[nombre] ?? nombre,
    }),
  );

  const onSubmit = (values: DatosFinancierosDraft) => {
    saveDatosFinancieros(values);
    goToStep(2);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
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
                required
                optional
                maxLength={12}
                placeholder="12 caracteres"
                className="uppercase"
              />
              <SelectField
                name="tipo_comision"
                label="Tipo de comisión"
                required
                options={TIPO_COMISION_OPTIONS}
                placeholder="Selecciona una comisión"
              />
              <TextField
                name="afp_fecha_filiacion"
                label="Fecha de filiación a la AFP"
                required
                optional
                type="date"
              />
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
          <CuentaBancariaFields
            cuenta="sueldo"
            bancoLabel="Banco de abono"
            sinBancoLabel="Sin cuenta bancaria"
            bancos={bancos.data}
            isLoadingBancos={bancos.isLoading}
          />
        </FormSection>

        <FormSection
          title="Cuenta de CTS"
          description="Entidad que recibe los depósitos semestrales de la compensación por tiempo de servicios."
        >
          <CuentaBancariaFields
            cuenta="cts"
            bancoLabel="Entidad financiera"
            sinBancoLabel="Sin cuenta de CTS"
            bancos={bancos.data}
            isLoadingBancos={bancos.isLoading}
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

        <RegistroFooter step={1} />
      </form>
    </FormProvider>
  );
}
