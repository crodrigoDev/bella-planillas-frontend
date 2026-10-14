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
import type {
  JornadaFormValues,
  JornadaListado,
} from "../../types/jornadas.types";
import { prepararJornada } from "../../utils/jornada-form.utils";
import { guardarJornadaMock } from "../../utils/jornadas.actions";
import JornadaGeneralFields from "./JornadaGeneralFields";
import JornadaScheduleFields from "./JornadaScheduleFields";
import JornadaSummary from "./JornadaSummary";
import JornadaSteps from "./JornadaSteps";

/** Reutiliza los tres pasos para crear o editar una jornada */
export default function JornadaForm({ jornada }: { jornada?: JornadaListado }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<CrearJornadaDto | null>(null);
  const form = useForm<JornadaFormValues, unknown, CrearJornadaDto>({
    resolver: zodResolver(CrearJornadaSchema),
    defaultValues: jornada ?? JORNADA_DEFAULT_VALUES,
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
      // Con un ID actualiza la jornada y sin ID agrega un registro nuevo
      guardarJornadaMock(prepararJornada(values), jornada?.id);
      void navigate(ROUTE_PATHS.asistencia.jornadas, {
        state: { message: jornada ? "Jornada actualizada" : "Jornada creada" },
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
        className="flex flex-col gap-6"
      >
        <JornadaSteps step={step} />
        <Card className="border border-border py-0 shadow-sm ring-0">
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
        <footer className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-background p-4 sm:px-5">
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
          <div className="flex flex-wrap gap-3">
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
              <Button type="submit">
                {jornada ? "Guardar cambios" : "Crear jornada"}
              </Button>
            )}
          </div>
        </footer>
      </form>
    </FormProvider>
  );
}
