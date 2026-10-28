import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BanknoteIcon,
  CreditCardIcon,
  HeartPulseIcon,
  LandmarkIcon,
  PiggyBankIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { FormSection } from "@/components/form/FormSection";
import { OptionSelect } from "@/components/form/OptionSelect";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FilterOption } from "@/lib/types/filters.types";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  REGIMEN_PENSION_LABELS,
  REGIMEN_SALUD_OPTIONS,
  REGIMENES_SALUD_CON_EPS,
  TIPO_COMISION_OPTIONS,
  TIPO_CUENTA_OPTIONS,
  esRegimenAfp,
} from "../config/empleados.config";
import { NUEVO_EMPLEADO_STEPS } from "../config/nuevoEmpleado.config";
import { useDatosFinancierosCatalogos } from "../hooks/useDatosFinancierosCatalogos";
import {
  createDatosFinancierosSchema,
  type DatosFinancierosDraft,
} from "../schemas/datosFinancieros.schema";
import { useNuevoEmpleadoStore } from "../store/nuevoEmpleado.store";

const NO_OPTIONS: FilterOption[] = [];

const REQUIRED_MARK = (
  <span aria-hidden className="text-destructive">
    *
  </span>
);

// Valores con los que empiezan los datos financieros de un empleado nuevo
const INITIAL_VALUES = {
  tipo_cuenta_sueldo: "SUELDO",
  tipo_cuenta_cts: "AHORROS",
  regimen_salud: "ESSALUD_REGULAR",
  eps_costo_adicional: 0,
} as const;

// Un campo opcional vacío no debe enviarse como texto vacío
const emptyToUndefined = (value: string) => value || undefined;

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
  const reset = useNuevoEmpleadoStore((state) => state.reset);

  const { regimenes, afps, bancos } = useDatosFinancierosCatalogos();

  const regimenesData = regimenes.data;

  // El esquema necesita saber qué régimen es el de las AFP, y eso lo dice el catálogo
  const resolver = useMemo(
    () =>
      createResolver((idRegimen) =>
        esRegimenAfp(regimenesData?.find((r) => r.id === idRegimen)?.nombre),
      ),
    [regimenesData],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFinancierosFormValues, unknown, DatosFinancierosDraft>({
    resolver,
    // Si el usuario vuelve a este paso, recupera lo que ya había escrito
    defaultValues: datosFinancieros ?? INITIAL_VALUES,
    // Los campos que se ocultan (AFP o EPS) dejan de validarse y de enviarse
    shouldUnregister: true,
  });

  const idRegimen = useWatch({ control, name: "id_regimen" });
  const regimenSalud = useWatch({ control, name: "regimen_salud" });

  const esAfp = esRegimenAfp(
    regimenesData?.find((regimen) => regimen.id === idRegimen)?.nombre,
  );
  const conEps = REGIMENES_SALUD_CON_EPS.includes(regimenSalud ?? "");

  const regimenOptions: FilterOption[] = (regimenesData ?? []).map(
    ({ id, nombre }) => ({
      value: id,
      label: REGIMEN_PENSION_LABELS[nombre] ?? nombre,
    }),
  );

  const onSubmit = (values: DatosFinancierosDraft) => {
    saveDatosFinancieros(values);
    goToStep(2);
  };

  const showError = (name: keyof typeof errors) => (
    <FieldError errors={[errors[name]]} />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <FormSection
        icon={LandmarkIcon}
        title="A. Previsión social y régimen de pensiones"
        description="Afiliación al Sistema Privado de Pensiones (AFP) o al Sistema Nacional de Pensiones (ONP)."
      >
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="id_regimen">
            Régimen previsional {REQUIRED_MARK}
          </FieldLabel>
          <Controller
            name="id_regimen"
            control={control}
            render={({ field }) => (
              <OptionSelect
                id="id_regimen"
                options={regimenOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona un régimen"
                isLoading={regimenes.isLoading}
                invalid={Boolean(errors.id_regimen)}
              />
            )}
          />
          {showError("id_regimen")}
        </Field>

        {esAfp && (
          <>
            <Field>
              <FieldLabel htmlFor="id_tipo_afp">
                AFP administradora {REQUIRED_MARK}
              </FieldLabel>
              <Controller
                name="id_tipo_afp"
                control={control}
                render={({ field }) => (
                  <OptionSelect
                    id="id_tipo_afp"
                    options={afps.data ?? NO_OPTIONS}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder="Selecciona una AFP"
                    isLoading={afps.isLoading}
                    invalid={Boolean(errors.id_tipo_afp)}
                  />
                )}
              />
              {showError("id_tipo_afp")}
            </Field>

            <Field>
              <FieldLabel htmlFor="cuspp">
                Código CUSPP {REQUIRED_MARK}
              </FieldLabel>
              <Input
                id="cuspp"
                maxLength={12}
                placeholder="12 caracteres"
                className="uppercase"
                aria-invalid={Boolean(errors.cuspp)}
                {...register("cuspp", { setValueAs: emptyToUndefined })}
              />
              {showError("cuspp")}
            </Field>

            <Field>
              <FieldLabel htmlFor="tipo_comision">
                Tipo de comisión {REQUIRED_MARK}
              </FieldLabel>
              <Controller
                name="tipo_comision"
                control={control}
                render={({ field }) => (
                  <OptionSelect
                    id="tipo_comision"
                    options={TIPO_COMISION_OPTIONS}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder="Selecciona una comisión"
                    invalid={Boolean(errors.tipo_comision)}
                  />
                )}
              />
              {showError("tipo_comision")}
            </Field>

            <Field>
              <FieldLabel htmlFor="afp_fecha_filiacion">
                Fecha de filiación a la AFP {REQUIRED_MARK}
              </FieldLabel>
              <Input
                id="afp_fecha_filiacion"
                type="date"
                aria-invalid={Boolean(errors.afp_fecha_filiacion)}
                {...register("afp_fecha_filiacion", {
                  setValueAs: emptyToUndefined,
                })}
              />
              {showError("afp_fecha_filiacion")}
            </Field>
          </>
        )}
      </FormSection>

      <FormSection
        icon={BanknoteIcon}
        title="B. Remuneración"
        description="Sueldo básico mensual pactado, en soles."
      >
        <Field>
          <FieldLabel htmlFor="sueldo_basico">
            Sueldo básico mensual (S/) {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="sueldo_basico"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            aria-invalid={Boolean(errors.sueldo_basico)}
            {...register("sueldo_basico")}
          />
          {showError("sueldo_basico")}
        </Field>
      </FormSection>

      <FormSection
        icon={CreditCardIcon}
        title="C. Cuenta bancaria de haberes"
        description="Cuenta donde se deposita el sueldo mensual o quincenal."
      >
        <Field>
          <FieldLabel htmlFor="id_banco_sueldo">Banco de abono</FieldLabel>
          <Controller
            name="id_banco_sueldo"
            control={control}
            render={({ field }) => (
              <FilterSelect
                id="id_banco_sueldo"
                ariaLabel="Banco de abono"
                allLabel="Sin cuenta bancaria"
                options={bancos.data ?? NO_OPTIONS}
                value={field.value ?? undefined}
                onChange={field.onChange}
                isLoading={bancos.isLoading}
                className="sm:w-full"
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="tipo_cuenta_sueldo">Tipo de cuenta</FieldLabel>
          <Controller
            name="tipo_cuenta_sueldo"
            control={control}
            render={({ field }) => (
              <OptionSelect
                id="tipo_cuenta_sueldo"
                options={TIPO_CUENTA_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona un tipo"
                invalid={Boolean(errors.tipo_cuenta_sueldo)}
              />
            )}
          />
          {showError("tipo_cuenta_sueldo")}
        </Field>

        <Field>
          <FieldLabel htmlFor="nro_cuenta_sueldo">Nº de cuenta</FieldLabel>
          <Input
            id="nro_cuenta_sueldo"
            aria-invalid={Boolean(errors.nro_cuenta_sueldo)}
            {...register("nro_cuenta_sueldo", { setValueAs: emptyToUndefined })}
          />
          {showError("nro_cuenta_sueldo")}
        </Field>

        <Field>
          <FieldLabel htmlFor="cci_sueldo">CCI</FieldLabel>
          <Input
            id="cci_sueldo"
            aria-invalid={Boolean(errors.cci_sueldo)}
            {...register("cci_sueldo", { setValueAs: emptyToUndefined })}
          />
          {showError("cci_sueldo")}
        </Field>
      </FormSection>

      <FormSection
        icon={PiggyBankIcon}
        title="D. Cuenta de CTS"
        description="Entidad que recibe los depósitos semestrales de la compensación por tiempo de servicios."
      >
        <Field>
          <FieldLabel htmlFor="id_banco_cts">Entidad financiera</FieldLabel>
          <Controller
            name="id_banco_cts"
            control={control}
            render={({ field }) => (
              <FilterSelect
                id="id_banco_cts"
                ariaLabel="Entidad financiera de la CTS"
                allLabel="Sin cuenta de CTS"
                options={bancos.data ?? NO_OPTIONS}
                value={field.value ?? undefined}
                onChange={field.onChange}
                isLoading={bancos.isLoading}
                className="sm:w-full"
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="tipo_cuenta_cts">Tipo de cuenta</FieldLabel>
          <Controller
            name="tipo_cuenta_cts"
            control={control}
            render={({ field }) => (
              <OptionSelect
                id="tipo_cuenta_cts"
                options={TIPO_CUENTA_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona un tipo"
                invalid={Boolean(errors.tipo_cuenta_cts)}
              />
            )}
          />
          {showError("tipo_cuenta_cts")}
        </Field>

        <Field>
          <FieldLabel htmlFor="nro_cuenta_cts">Nº de cuenta</FieldLabel>
          <Input
            id="nro_cuenta_cts"
            aria-invalid={Boolean(errors.nro_cuenta_cts)}
            {...register("nro_cuenta_cts", { setValueAs: emptyToUndefined })}
          />
          {showError("nro_cuenta_cts")}
        </Field>

        <Field>
          <FieldLabel htmlFor="cci_cts">CCI</FieldLabel>
          <Input
            id="cci_cts"
            aria-invalid={Boolean(errors.cci_cts)}
            {...register("cci_cts", { setValueAs: emptyToUndefined })}
          />
          {showError("cci_cts")}
        </Field>
      </FormSection>

      <FormSection
        icon={HeartPulseIcon}
        title="E. Régimen de salud"
        description="Prestaciones de salud obligatorias y planes de salud complementarios."
      >
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="regimen_salud">Régimen de salud</FieldLabel>
          <Controller
            name="regimen_salud"
            control={control}
            render={({ field }) => (
              <OptionSelect
                id="regimen_salud"
                options={REGIMEN_SALUD_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona un régimen"
                invalid={Boolean(errors.regimen_salud)}
              />
            )}
          />
          {showError("regimen_salud")}
        </Field>

        {conEps && (
          <>
            <Field>
              <FieldLabel htmlFor="eps_nombre">Entidad EPS</FieldLabel>
              <Input
                id="eps_nombre"
                aria-invalid={Boolean(errors.eps_nombre)}
                {...register("eps_nombre", { setValueAs: emptyToUndefined })}
              />
              {showError("eps_nombre")}
            </Field>

            <Field>
              <FieldLabel htmlFor="eps_plan">Plan contratado</FieldLabel>
              <Input
                id="eps_plan"
                aria-invalid={Boolean(errors.eps_plan)}
                {...register("eps_plan", { setValueAs: emptyToUndefined })}
              />
              {showError("eps_plan")}
            </Field>

            <Field>
              <FieldLabel htmlFor="eps_costo_adicional">
                Copago mensual del colaborador (S/)
              </FieldLabel>
              <Input
                id="eps_costo_adicional"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                aria-invalid={Boolean(errors.eps_costo_adicional)}
                {...register("eps_costo_adicional")}
              />
              {showError("eps_costo_adicional")}
            </Field>
          </>
        )}
      </FormSection>

      <StepperFooter
        cancelAction={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to={ROUTE_PATHS.gestionPersonal.empleados} />}
            onClick={reset}
          >
            Cancelar
          </Button>
        }
        progressLabel={`Paso 2 de ${NUEVO_EMPLEADO_STEPS.length} completándose`}
      >
        <Button variant="outline" onClick={() => goToStep(0)}>
          <ArrowLeftIcon data-icon="inline-start" />
          Atrás
        </Button>
        <Button type="submit">
          Guardar y continuar
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </StepperFooter>
    </form>
  );
}
