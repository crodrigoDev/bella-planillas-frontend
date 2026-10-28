import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon, FileSignatureIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { FormField } from "@/components/form/FormField";
import { FormSection } from "@/components/form/FormSection";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { NUEVO_EMPLEADO_STEPS } from "../../config/nuevoEmpleado.config";
import {
  DatosContratoSchema,
  type DatosContratoDraft,
} from "../../schemas/datosContrato.schema";
import { useModalidadesContrato } from "../../hooks/useModalidadesContrato";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";

const resolver = zodResolver(DatosContratoSchema, zodResolverOptions);

// Valores del formulario antes de validar: la modalidad tiene un valor por
// defecto en el contrato y todavía es opcional.
type DatosContratoFormValues = Parameters<typeof resolver>[0];

/**
 * Paso 3 del registro: modalidad y vigencia del contrato
 *
 * @remarks
 * Valida con el esquema de shared contracts y guarda los datos en el
 * borrador del asistente. La fecha de inicio parte de la fecha de inicio de
 * labores del paso 1, pero se puede cambiar. La fecha de fin solo aparece
 * si el contrato no es indeterminado.
 */
export function DatosContratoForm() {
  const datos = useNuevoEmpleadoStore((state) => state.datos);
  const contrato = useNuevoEmpleadoStore((state) => state.contrato);
  const saveContrato = useNuevoEmpleadoStore((state) => state.saveContrato);
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);
  const reset = useNuevoEmpleadoStore((state) => state.reset);

  const methods = useForm<
    DatosContratoFormValues,
    unknown,
    DatosContratoDraft
  >({
    resolver,
    // Si el usuario vuelve a este paso, recupera lo que ya había escrito
    defaultValues: contrato ?? {
      tipo_modalidad: "PLAZO_FIJO",
      fecha_inicio: datos?.fecha_inicio ?? "",
    },
    // La fecha de fin se oculta en un contrato indeterminado: deja de enviarse
    shouldUnregister: true,
  });
  const { register, control, handleSubmit } = methods;

  const modalidad = useWatch({ control, name: "tipo_modalidad" });
  const esIndeterminado = modalidad === "INDETERMINADO";

  const modalidades = useModalidadesContrato();

  const onSubmit = (values: DatosContratoDraft) => {
    saveContrato(values);
    goToStep(3);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <FormSection
          icon={FileSignatureIcon}
          title="A. Datos del contrato"
          description="Modalidad y vigencia del vínculo laboral."
        >
          <SelectField
            name="tipo_modalidad"
            label="Modalidad"
            options={modalidades.data}
            placeholder="Selecciona una modalidad"
            isLoading={modalidades.isLoading}
          />
          <TextField
            name="fecha_inicio"
            label="Fecha de inicio"
            required
            type="date"
          />
          {!esIndeterminado && (
            <TextField
              name="fecha_fin"
              label="Fecha de fin"
              optional
              type="date"
            />
          )}

          <FormField
            name="observacion"
            label="Observación"
            className="sm:col-span-2 lg:col-span-4"
          >
            {(invalid) => (
              <Textarea
                id="observacion"
                maxLength={500}
                aria-invalid={invalid}
                {...register("observacion", {
                  setValueAs: (value: string) => value || undefined,
                })}
              />
            )}
          </FormField>
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
          progressLabel={`Paso 3 de ${NUEVO_EMPLEADO_STEPS.length} completándose`}
        >
          <Button variant="outline" onClick={() => goToStep(1)}>
            <ArrowLeftIcon data-icon="inline-start" />
            Atrás
          </Button>
          <Button type="submit">
            Guardar y continuar
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </StepperFooter>
      </form>
    </FormProvider>
  );
}
