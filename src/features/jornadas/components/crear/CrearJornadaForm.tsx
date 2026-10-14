import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CrearJornadaSchema,
  type CrearJornadaDto,
} from "@jyp/shared-contracts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_PATHS } from "@/app/routes/path";
import { JORNADA_DEFAULT_VALUES } from "../../config/jornada-form.config";
import type { JornadaFormValues } from "../../types/jornadas.types";
import { prepararJornada } from "../../utils/jornada-form.utils";
import { guardarJornadaMock } from "../../utils/jornadas.actions";
import JornadaGeneralFields from "../form/JornadaGeneralFields";
import JornadaScheduleFields from "../form/JornadaScheduleFields";
import JornadaSummary from "../form/JornadaSummary";
import JornadaSteps from "./JornadaSteps";

/** Divide el registro en datos, horario y confirmacion */
export default function CrearJornadaForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<CrearJornadaDto | null>(null);
  const form = useForm<JornadaFormValues, unknown, CrearJornadaDto>({
    resolver: zodResolver(CrearJornadaSchema),
    defaultValues: JORNADA_DEFAULT_VALUES,
    mode: "onTouched",
  });
  const next = async (): Promise<void> => {
    form.clearErrors("root");
    const valid = await form.trigger(
      step === 0
        ? [
            "nombre",
            "descripcion",
            "duracion",
            "modalidad",
            "turno",
            "tolerancia_minutos",
            "areas_ids",
            "activo",
          ]
        : ["horario_semanal", "patron_rotacion"],
    );
    if (!valid) return;
    try {
      if (step === 1) setPreview(prepararJornada(form.getValues()));
      setStep(step + 1);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Revisa la configuración",
      });
    }
  };
  const submit = (values: CrearJornadaDto): void => {
    // Enter en los primeros pasos avanza sin guardar todavia
    if (step < 2) {
      void next();
      return;
    }
    try {
      guardarJornadaMock(prepararJornada(values));
      void navigate(ROUTE_PATHS.asistencia.jornadas, {
        state: { message: "Jornada creada en la vista de prueba" },
      });
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo guardar la jornada",
      });
    }
  };
  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={(event) => {
          if (step < 2) {
            event.preventDefault();
            void next();
          } else void form.handleSubmit(submit)(event);
        }}
        className="flex min-h-[calc(100dvh-150px)] flex-col"
      >
        <JornadaSteps step={step} />
        <Card className="mb-6 border border-border py-0 shadow-sm ring-0">
          <CardContent className="p-5 sm:p-6">
            {step === 0 && <JornadaGeneralFields />}
            {step === 1 && <JornadaScheduleFields />}
            {step === 2 && preview && <JornadaSummary values={preview} />}
            {form.formState.errors.root && (
              <p role="alert" className="mt-4 text-xs text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
          </CardContent>
        </Card>
        <footer className="sticky bottom-0 z-10 mt-auto flex flex-wrap items-center justify-between gap-3 border-t bg-background py-4">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep((current) => current - 1);
                form.clearErrors("root");
              }}
            >
              <ChevronLeft aria-hidden className="size-3.5" />
              Atrás
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              render={<Link to={ROUTE_PATHS.asistencia.jornadas} />}
            >
              <ChevronLeft aria-hidden className="size-3.5" />
              Volver
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              render={<Link to={ROUTE_PATHS.asistencia.jornadas} />}
            >
              Cancelar
            </Button>
            {step < 2 ? (
              <Button type="button" onClick={() => void next()}>
                Siguiente
                <ChevronRight aria-hidden className="size-3.5" />
              </Button>
            ) : (
              <Button type="submit">Crear jornada</Button>
            )}
          </div>
        </footer>
      </form>
    </FormProvider>
  );
}
