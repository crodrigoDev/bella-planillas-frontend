import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { FormSection } from "@/components/form/FormSection";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  ESTADO_CIVIL_OPTIONS,
  SEXO_OPTIONS,
  VINCULO_OPTIONS,
} from "../../config/empleados.config";
import { NUEVO_EMPLEADO_STEPS } from "../../config/nuevoEmpleado.config";
import { useTiposDocumento } from "../../hooks/useTiposDocumento";
import {
  DatosDerechohabienteSchema,
  type DerechohabienteDraft,
} from "../../schemas/datosDerechohabiente.schema";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";

const resolver = zodResolver(DatosDerechohabienteSchema, zodResolverOptions);

type DerechohabienteFormValues = Parameters<typeof resolver>[0];

// Valores con los que empieza cada derechohabiente que se agrega
const EMPTY_VALUES = {
  nro_documento: "",
  nombres: "",
  apellidos: "",
  estado_civil: "SOLTERO",
  fecha_nacimiento: "",
} as const;

const getLabel = (options: { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

/**
 * Paso 4 del registro: familiares del empleado con derecho a beneficios
 *
 * @remarks
 * Es opcional. Cada derechohabiente se valida con el esquema de shared
 * contracts y se agrega a la lista del borrador del asistente; se guardan
 * junto al empleado en el último paso.
 */
export function DatosDerechohabientesForm() {
  const derechohabientes = useNuevoEmpleadoStore(
    (state) => state.derechohabientes,
  );
  const addDerechohabiente = useNuevoEmpleadoStore(
    (state) => state.addDerechohabiente,
  );
  const removeDerechohabiente = useNuevoEmpleadoStore(
    (state) => state.removeDerechohabiente,
  );
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);
  const reset = useNuevoEmpleadoStore((state) => state.reset);

  const tiposDocumento = useTiposDocumento();

  const methods = useForm<
    DerechohabienteFormValues,
    unknown,
    DerechohabienteDraft
  >({
    resolver,
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = (values: DerechohabienteDraft) => {
    // El backend rechaza dos familiares con el mismo documento
    if (
      derechohabientes.some(
        (item) => item.nro_documento === values.nro_documento,
      )
    ) {
      methods.setError("nro_documento", {
        message: "Ya agregaste un familiar con este documento",
      });
      return;
    }

    addDerechohabiente(values);
    methods.reset(EMPTY_VALUES);
  };

  return (
    <div className="space-y-6">
      <FormSection
        icon={UsersIcon}
        title="A. Derechohabientes agregados"
        description="Cónyuge, hijos y otros familiares con derecho a beneficios. Este paso es opcional."
      >
        {derechohabientes.length === 0 ? (
          <p className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-4">
            Aún no agregaste ningún derechohabiente.
          </p>
        ) : (
          <ul className="space-y-2 sm:col-span-2 lg:col-span-4">
            {derechohabientes.map((item, index) => (
              <li
                key={item.nro_documento}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {item.nombres} {item.apellidos}
                  </p>
                  <p className="text-muted-foreground">
                    {getLabel(VINCULO_OPTIONS, item.vinculo)} ·{" "}
                    {item.nro_documento}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Quitar a ${item.nombres} ${item.apellidos}`}
                  onClick={() => removeDerechohabiente(index)}
                >
                  <Trash2Icon />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </FormSection>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <FormSection
            icon={PlusIcon}
            title="B. Agregar derechohabiente"
            description="Completa los datos del familiar y agrégalo a la lista."
          >
            <SelectField
              name="vinculo"
              label="Vínculo"
              required
              options={VINCULO_OPTIONS}
              placeholder="Selecciona un vínculo"
            />
            <SelectField
              name="documento_id"
              label="Tipo de documento"
              required
              options={tiposDocumento.data}
              placeholder="Selecciona un tipo"
              isLoading={tiposDocumento.isLoading}
            />
            <TextField
              name="nro_documento"
              label="Nº de documento"
              required
              placeholder="8 a 20 caracteres"
            />
            <TextField name="nombres" label="Nombres" required />
            <TextField name="apellidos" label="Apellidos" required />
            <SelectField
              name="sexo"
              label="Sexo"
              required
              options={SEXO_OPTIONS}
              placeholder="Selecciona el sexo"
            />
            <SelectField
              name="estado_civil"
              label="Estado civil"
              required
              options={ESTADO_CIVIL_OPTIONS}
              placeholder="Selecciona un estado civil"
            />
            <TextField
              name="fecha_nacimiento"
              label="Fecha de nacimiento"
              required
              type="date"
            />

            <div className="flex justify-end sm:col-span-2 lg:col-span-4">
              <Button type="submit" variant="outline">
                <PlusIcon data-icon="inline-start" />
                Agregar a la lista
              </Button>
            </div>
          </FormSection>
        </form>
      </FormProvider>

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
        progressLabel={`Paso 4 de ${NUEVO_EMPLEADO_STEPS.length} completándose`}
      >
        <Button variant="outline" onClick={() => goToStep(2)}>
          <ArrowLeftIcon data-icon="inline-start" />
          Atrás
        </Button>
        <Button onClick={() => goToStep(4)}>
          Continuar
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </StepperFooter>
    </div>
  );
}
