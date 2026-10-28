import { FormProvider, useForm, useWatch } from "react-hook-form";
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
import { FormSection } from "@/components/form/FormSection";
import { RequiredMark } from "@/components/form/RequiredMark";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
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
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  ESTADO_CIVIL_OPTIONS,
  SEXO_OPTIONS,
} from "../../config/empleados.config";
import { NUEVO_EMPLEADO_STEPS } from "../../config/nuevoEmpleado.config";
import { useEmpleadosCatalogos } from "../../hooks/useEmpleadosCatalogos";
import { useTiposDocumento } from "../../hooks/useTiposDocumento";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";

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

const resolver = zodResolver(CrearEmpleadoSchema, zodResolverOptions);

// Valores del formulario antes de validar: los campos con valor por defecto
// del contrato todavía son opcionales. Se indican a `useForm` de forma
// explícita para que no los deduzca de `INITIAL_VALUES`.
type DatosEmpleadoFormValues = Parameters<typeof resolver>[0];

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

  const methods = useForm<DatosEmpleadoFormValues, unknown, CrearEmpleadoDto>({
    resolver,
    // Si el usuario vuelve a este paso, recupera lo que ya había escrito
    defaultValues: datos ?? INITIAL_VALUES,
  });
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const areaId = useWatch({ control, name: "area_id" });
  const tiposDocumento = useTiposDocumento();
  const { areas, cargos, jornadas } = useEmpleadosCatalogos(areaId);

  const onSubmit = (values: CrearEmpleadoDto) => {
    saveDatos(values);
    goToStep(1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <FormSection
          icon={IdCardIcon}
          title="A. Identificación y datos personales"
          description="Información legal y datos de identidad del colaborador."
        >
          <SelectField
            name="documento_id"
            label="Tipo de documento"
            required
            options={tiposDocumento.data}
            placeholder="Selecciona un tipo"
            isLoading={tiposDocumento.isLoading}
            description={
              tiposDocumento.isError
                ? "No se pudieron cargar los tipos de documento."
                : undefined
            }
          />
          <TextField
            name="nro_documento"
            label="Nº de documento"
            required
            placeholder="Ej. 74839201 (8 a 20 caracteres)"
          />
          <TextField
            name="nombre"
            label="Nombres"
            required
            placeholder="Ej. Carlos Alberto"
          />
          <TextField
            name="apellido"
            label="Apellidos"
            required
            placeholder="Ej. Mendoza Ramírez"
          />

          <Field>
            <FieldTitle id="sexo-label">
              Sexo <RequiredMark />
            </FieldTitle>
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
            <FieldError errors={[errors.sexo]} />
          </Field>

          <SelectField
            name="estado_civil"
            label="Estado civil"
            options={ESTADO_CIVIL_OPTIONS}
            placeholder="Selecciona un estado civil"
          />
          <TextField name="nacionalidad" label="Nacionalidad" />
          <TextField
            name="fecha_nacimiento"
            label="Fecha de nacimiento"
            required
            type="date"
          />
        </FormSection>

        <FormSection
          icon={MapPinHouseIcon}
          title="B. Contacto y domicilio"
          description="Dirección de residencia habitual y canales de comunicación del colaborador."
        >
          <TextField
            name="email"
            label="Correo electrónico"
            required
            type="email"
            placeholder="ejemplo@empresa.com"
          />
          <TextField
            name="telefono"
            label="Teléfono / celular"
            required
            type="tel"
            placeholder="Ej. 987 654 321"
          />
          <TextField
            name="direccion"
            label="Dirección de residencia"
            required
            placeholder="Av. José Larco 812, Dpto. 402"
            fieldClassName="sm:col-span-2"
          />
          <TextField
            name="referencia_direccion"
            label="Referencia de ubicación"
            required
            placeholder="A media cuadra del Parque Kennedy, frente al banco"
            fieldClassName="sm:col-span-2 lg:col-span-4"
          />
          <TextField name="departamento" label="Departamento" required />
          <TextField name="provincia" label="Provincia" required />
          <TextField name="distrito" label="Distrito" required />
          <TextField
            name="ubigeo"
            label="Ubigeo (6 dígitos)"
            required
            inputMode="numeric"
            maxLength={6}
            placeholder="150122"
          />
        </FormSection>

        <FormSection
          icon={Building2Icon}
          title="C. Asignación laboral"
          description="Posición dentro de la estructura organizacional y fecha de inicio de labores."
        >
          <SelectField
            name="area_id"
            label="Área"
            required
            options={areas.data}
            placeholder="Selecciona un área..."
            isLoading={areas.isLoading}
            // Un cargo pertenece a un área: al cambiarla hay que elegir otro
            onValueChange={() => setValue("cargo_id", undefined as never)}
          />
          <SelectField
            name="cargo_id"
            label="Cargo"
            required
            options={cargos.data}
            placeholder="Selecciona un cargo..."
            isLoading={cargos.isLoading}
          />
          <SelectField
            name="jornada_id"
            label="Jornada (opcional)"
            options={jornadas.data}
            isLoading={jornadas.isLoading}
            clearLabel="Sin jornada específica"
          />

          <Field>
            <FieldLabel htmlFor="estado_laboral">Estado laboral</FieldLabel>
            <Input id="estado_laboral" value="Activo" disabled readOnly />
            <FieldDescription>Alta inicial en sistema</FieldDescription>
          </Field>

          <TextField
            name="fecha_inicio"
            label="Fecha de inicio de labores"
            required
            type="date"
          />

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
    </FormProvider>
  );
}
