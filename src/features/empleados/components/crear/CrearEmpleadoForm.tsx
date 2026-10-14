import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { ROUTE_PATHS } from "@/app/routes/path";
import { CREAR_EMPLEADO_DEFAULTS, CREAR_EMPLEADO_STEPS } from "../../config/crear-empleado.config";
import type { CrearEmpleadoFormValues, RegistroEmpleadoDto } from "../../types/crear-empleado.types";
import { RegistroEmpleadoSchema } from "../../schemas/registro-empleado.schema";
import EmpleadoRegistroSteps from "./EmpleadoRegistroSteps";
import EmpleadoDatosPersonales from "../form/EmpleadoDatosPersonales";
import EmpleadoDatosLaborales from "../form/EmpleadoDatosLaborales";
import EmpleadoRegistroResumen from "./EmpleadoRegistroResumen";
import EmpleadoContrato from "./EmpleadoContrato";
import EmpleadoDatosFinancieros from "./EmpleadoDatosFinancieros";

interface CrearEmpleadoFormProps {
  onSubmit: (values: RegistroEmpleadoDto) => void | Promise<void>;
}

/** Valida cada paso y entrega el contrato completo al confirmar el registro */
export default function CrearEmpleadoForm({ onSubmit }: CrearEmpleadoFormProps) {
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const form = useForm<CrearEmpleadoFormValues, unknown, RegistroEmpleadoDto>({
    resolver: zodResolver(RegistroEmpleadoSchema),
    defaultValues: CREAR_EMPLEADO_DEFAULTS,
    mode: "onTouched",
    // Conserva lo escrito cuando los campos de un paso dejan de mostrarse
    shouldUnregister: false,
  });
  const { isSubmitting, isValidating, errors } = form.formState;
  const isLastStep = step === CREAR_EMPLEADO_STEPS.length - 1;

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const nextStep = async (): Promise<void> => {
    const valid = await form.trigger(CREAR_EMPLEADO_STEPS[step].fields, { shouldFocus: true });
    if (valid) setStep((current) => Math.min(current + 1, CREAR_EMPLEADO_STEPS.length - 1));
  };

  const submit = async (values: RegistroEmpleadoDto): Promise<void> => {
    try {
      await onSubmit(values);
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "No se pudo registrar el empleado",
      });
    }
  };

  const showInvalidStep = (): void => {
    const invalidStep = CREAR_EMPLEADO_STEPS.findIndex((item) =>
      item.fields.some((name) => form.getFieldState(name).invalid),
    );
    if (invalidStep >= 0) setStep(invalidStep);
  };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="space-y-6"
        onSubmit={(event) => {
          if (isLastStep) void form.handleSubmit(submit, showInvalidStep)(event);
          else {
            event.preventDefault();
            void nextStep();
          }
        }}
      >
        <EmpleadoRegistroSteps current={step} />
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Paso {step + 1}: {CREAR_EMPLEADO_STEPS[step].title}
        </h2>
        {step === 0 && <EmpleadoDatosPersonales />}
        {step === 1 && <EmpleadoDatosLaborales />}
        {step === 2 && <EmpleadoContrato />}
        {step === 3 && <EmpleadoDatosFinancieros />}
        {step === 4 && <EmpleadoRegistroResumen />}
        <FieldError errors={[errors.root]} />
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-background p-4 sm:px-6">
          <p className="text-xs text-muted-foreground">Paso {step + 1} de {CREAR_EMPLEADO_STEPS.length}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="ghost" size="sm" disabled={isSubmitting} render={<Link to={ROUTE_PATHS.gestionPersonal.empleados} />}>
              Cancelar
            </Button>
            {step > 0 && (
              <Button type="button" variant="outline" size="sm" disabled={isSubmitting || isValidating} onClick={() => setStep((current) => current - 1)}>
                <ArrowLeft aria-hidden="true" /> Anterior
              </Button>
            )}
            <Button type="submit" size="sm" disabled={isSubmitting || isValidating}>
              {isSubmitting ? <Spinner aria-hidden="true" /> : isLastStep ? <Check aria-hidden="true" /> : null}
              {isSubmitting ? "Registrando…" : isLastStep ? "Registrar empleado" : "Continuar"}
              {!isLastStep && <ArrowRight aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
