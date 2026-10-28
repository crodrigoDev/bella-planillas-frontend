import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CrearEmpleadoSchema,
  type CrearEmpleadoDto,
} from "@jyp/shared-contracts";
import {
  ArrowRightIcon,
  Building2Icon,
  IdCardIcon,
  MapPinHouseIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { FormSection } from "@/components/form/FormSection";
import { OptionSelect } from "@/components/form/OptionSelect";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FilterOption } from "@/lib/types/filters.types";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from "../config/empleados.config";
import { NUEVO_EMPLEADO_STEPS } from "../config/nuevoEmpleado.config";
import { useEmpleadosCatalogos } from "../hooks/useEmpleadosCatalogos";
import { useTiposDocumento } from "../hooks/useTiposDocumento";
import { useNuevoEmpleadoStore } from "../store/nuevoEmpleado.store";

const NO_OPTIONS: FilterOption[] = [];

const REQUIRED_MARK = (
  <span aria-hidden className="text-destructive">
    *
  </span>
);

// Valores con los que empieza un empleado nuevo, como en el diseño
const INITIAL_VALUES = {
  nro_documento: "",
  nombre: "",
  apellido: "",
  sexo: "MASCULINO",
  estado_civil: "SOLTERO",
  nacionalidad: "PERUANA",
  fecha_nacimiento: "",
  email: "",
  telefono: "",
  direccion: "",
  referencia_direccion: "",
  departamento: "",
  provincia: "",
  distrito: "",
  ubigeo: "",
  fecha_inicio: "",
  asig_familiar: false,
} as const;

/**
 * Paso 1 del registro: datos personales, domicilio y asignación laboral
 *
 * @remarks
 * Valida con el esquema de shared contracts y, al continuar, guarda los
 * datos en el borrador del asistente. El empleado se crea en el último paso.
 */
export function DatosEmpleadoForm() {
  const datos = useNuevoEmpleadoStore((state) => state.datos);
  const saveDatos = useNuevoEmpleadoStore((state) => state.saveDatos);
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);
  const reset = useNuevoEmpleadoStore((state) => state.reset);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CrearEmpleadoSchema, zodResolverOptions),
    // Si el usuario vuelve a este paso, recupera lo que ya había escrito
    defaultValues: datos ?? INITIAL_VALUES,
  });

  const areaId = useWatch({ control, name: "area_id" });
  const tiposDocumento = useTiposDocumento();
  const { areas, cargos, jornadas } = useEmpleadosCatalogos(areaId);

  const onSubmit = (values: CrearEmpleadoDto) => {
    saveDatos(values);
    goToStep(1);
  };

  const showError = (name: keyof typeof errors) => (
    <FieldError errors={[errors[name]]} />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <FormSection
        icon={IdCardIcon}
        title="A. Identificación y datos personales"
        description="Información legal y datos de identidad del colaborador."
      >
        <Field>
          <FieldLabel htmlFor="documento_id">
            Tipo de documento {REQUIRED_MARK}
          </FieldLabel>
          <Controller
            name="documento_id"
            control={control}
            render={({ field }) => (
              <OptionSelect
                id="documento_id"
                options={tiposDocumento.data ?? NO_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona un tipo"
                isLoading={tiposDocumento.isLoading}
                invalid={Boolean(errors.documento_id)}
              />
            )}
          />
          {showError("documento_id")}
          {tiposDocumento.isError && (
            <FieldDescription>
              No se pudieron cargar los tipos de documento.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="nro_documento">
            Nº de documento {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="nro_documento"
            placeholder="Ej. 74839201 (8 a 20 caracteres)"
            aria-invalid={Boolean(errors.nro_documento)}
            {...register("nro_documento")}
          />
          {showError("nro_documento")}
        </Field>

        <Field>
          <FieldLabel htmlFor="nombre">Nombres {REQUIRED_MARK}</FieldLabel>
          <Input
            id="nombre"
            placeholder="Ej. Carlos Alberto"
            aria-invalid={Boolean(errors.nombre)}
            {...register("nombre")}
          />
          {showError("nombre")}
        </Field>

        <Field>
          <FieldLabel htmlFor="apellido">Apellidos {REQUIRED_MARK}</FieldLabel>
          <Input
            id="apellido"
            placeholder="Ej. Mendoza Ramírez"
            aria-invalid={Boolean(errors.apellido)}
            {...register("apellido")}
          />
          {showError("apellido")}
        </Field>

        <Field>
          <FieldTitle id="sexo-label">Sexo {REQUIRED_MARK}</FieldTitle>
          <div
            role="radiogroup"
            aria-labelledby="sexo-label"
            className="grid grid-cols-2 gap-2"
          >
            {SEXO_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-sm has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
              >
                <input
                  type="radio"
                  value={option.value}
                  className="accent-primary"
                  {...register("sexo")}
                />
                {option.label}
              </label>
            ))}
          </div>
          {showError("sexo")}
        </Field>

        <Field>
          <FieldLabel htmlFor="estado_civil">Estado civil</FieldLabel>
          <Controller
            name="estado_civil"
            control={control}
            render={({ field }) => (
              <OptionSelect
                id="estado_civil"
                options={ESTADO_CIVIL_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona un estado civil"
                invalid={Boolean(errors.estado_civil)}
              />
            )}
          />
          {showError("estado_civil")}
        </Field>

        <Field>
          <FieldLabel htmlFor="nacionalidad">Nacionalidad</FieldLabel>
          <Input
            id="nacionalidad"
            aria-invalid={Boolean(errors.nacionalidad)}
            {...register("nacionalidad")}
          />
          {showError("nacionalidad")}
        </Field>

        <Field>
          <FieldLabel htmlFor="fecha_nacimiento">
            Fecha de nacimiento {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="fecha_nacimiento"
            type="date"
            aria-invalid={Boolean(errors.fecha_nacimiento)}
            {...register("fecha_nacimiento")}
          />
          {showError("fecha_nacimiento")}
        </Field>
      </FormSection>

      <FormSection
        icon={MapPinHouseIcon}
        title="B. Contacto y domicilio"
        description="Dirección de residencia habitual y canales de comunicación del colaborador."
      >
        <Field>
          <FieldLabel htmlFor="email">
            Correo electrónico {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@empresa.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {showError("email")}
        </Field>

        <Field>
          <FieldLabel htmlFor="telefono">
            Teléfono / celular {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="telefono"
            type="tel"
            placeholder="Ej. 987 654 321"
            aria-invalid={Boolean(errors.telefono)}
            {...register("telefono")}
          />
          {showError("telefono")}
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="direccion">
            Dirección de residencia {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="direccion"
            placeholder="Av. José Larco 812, Dpto. 402"
            aria-invalid={Boolean(errors.direccion)}
            {...register("direccion")}
          />
          {showError("direccion")}
        </Field>

        <Field className="sm:col-span-2 lg:col-span-4">
          <FieldLabel htmlFor="referencia_direccion">
            Referencia de ubicación {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="referencia_direccion"
            placeholder="A media cuadra del Parque Kennedy, frente al banco"
            aria-invalid={Boolean(errors.referencia_direccion)}
            {...register("referencia_direccion")}
          />
          {showError("referencia_direccion")}
        </Field>

        <Field>
          <FieldLabel htmlFor="departamento">
            Departamento {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="departamento"
            aria-invalid={Boolean(errors.departamento)}
            {...register("departamento")}
          />
          {showError("departamento")}
        </Field>

        <Field>
          <FieldLabel htmlFor="provincia">Provincia {REQUIRED_MARK}</FieldLabel>
          <Input
            id="provincia"
            aria-invalid={Boolean(errors.provincia)}
            {...register("provincia")}
          />
          {showError("provincia")}
        </Field>

        <Field>
          <FieldLabel htmlFor="distrito">Distrito {REQUIRED_MARK}</FieldLabel>
          <Input
            id="distrito"
            aria-invalid={Boolean(errors.distrito)}
            {...register("distrito")}
          />
          {showError("distrito")}
        </Field>

        <Field>
          <FieldLabel htmlFor="ubigeo">
            Ubigeo (6 dígitos) {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="ubigeo"
            inputMode="numeric"
            maxLength={6}
            placeholder="150122"
            aria-invalid={Boolean(errors.ubigeo)}
            {...register("ubigeo")}
          />
          {showError("ubigeo")}
        </Field>
      </FormSection>

      <FormSection
        icon={Building2Icon}
        title="C. Asignación laboral"
        description="Posición dentro de la estructura organizacional y fecha de inicio de labores."
      >
        <Field>
          <FieldLabel htmlFor="cargo_id">Cargo {REQUIRED_MARK}</FieldLabel>
          <Controller
            name="cargo_id"
            control={control}
            render={({ field }) => (
              <OptionSelect
                id="cargo_id"
                options={cargos.data ?? NO_OPTIONS}
                value={field.value || undefined}
                onChange={field.onChange}
                placeholder="Selecciona un cargo..."
                isLoading={cargos.isLoading}
                invalid={Boolean(errors.cargo_id)}
              />
            )}
          />
          {showError("cargo_id")}
        </Field>

        <Field>
          <FieldLabel htmlFor="area_id">Área {REQUIRED_MARK}</FieldLabel>
          <Controller
            name="area_id"
            control={control}
            render={({ field }) => (
              <OptionSelect
                id="area_id"
                options={areas.data ?? NO_OPTIONS}
                value={field.value}
                onChange={(next) => {
                  field.onChange(next);
                  // Un cargo pertenece a un área: al cambiarla hay que elegir otro
                  setValue("cargo_id", undefined as never);
                }}
                placeholder="Selecciona un área..."
                isLoading={areas.isLoading}
                invalid={Boolean(errors.area_id)}
              />
            )}
          />
          {showError("area_id")}
        </Field>

        <Field>
          <FieldLabel htmlFor="jornada_id">Jornada (opcional)</FieldLabel>
          <Controller
            name="jornada_id"
            control={control}
            render={({ field }) => (
              <FilterSelect
                id="jornada_id"
                ariaLabel="Jornada"
                allLabel="Sin jornada específica"
                options={jornadas.data ?? NO_OPTIONS}
                value={field.value ?? undefined}
                onChange={field.onChange}
                isLoading={jornadas.isLoading}
                className="sm:w-full"
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="estado_laboral">Estado laboral</FieldLabel>
          <Input id="estado_laboral" value="Activo" disabled readOnly />
          <FieldDescription>Alta inicial en sistema</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="fecha_inicio">
            Fecha de inicio de labores {REQUIRED_MARK}
          </FieldLabel>
          <Input
            id="fecha_inicio"
            type="date"
            aria-invalid={Boolean(errors.fecha_inicio)}
            {...register("fecha_inicio")}
          />
          {showError("fecha_inicio")}
        </Field>

        <Field className="sm:col-span-2">
          <FieldTitle>Asignación familiar</FieldTitle>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-primary"
              {...register("asig_familiar")}
            />
            <span>
              Indica si el trabajador acredita hijos menores o dependientes
              cursando estudios superiores (Ley Nº 25129).
            </span>
          </label>
        </Field>
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
        progressLabel={`Paso 1 de ${NUEVO_EMPLEADO_STEPS.length} completándose`}
      >
        <Button type="submit">
          Guardar y continuar
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </StepperFooter>
    </form>
  );
}
