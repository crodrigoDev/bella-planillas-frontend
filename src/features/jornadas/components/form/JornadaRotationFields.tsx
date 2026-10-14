import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModuleField from "@/components/modules/ModuleField";
import { enumItems } from "@/components/modules/module.utils";
import type { JornadaFormValues } from "../../types/jornadas.types";
import JornadaChoiceGroup from "./JornadaChoiceGroup";

/** Configura el patron de rotacion disponible en el backend */
export default function JornadaRotationFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<JornadaFormValues>();
  const error = errors.patron_rotacion;
  return (
    <fieldset className="space-y-4 rounded-lg border border-primary/15 bg-primary/[0.02] p-4">
      <legend className="px-1 text-xs font-medium text-primary">
        Patrón de rotación
      </legend>
      <div className="grid gap-4 sm:grid-cols-3">
        <ModuleField
          id="rotacion-ciclo"
          label="Tipo de ciclo (ej. 5x2)"
          error={error?.tipo_ciclo}
        >
          <Input
            id="rotacion-ciclo"
            {...register("patron_rotacion.tipo_ciclo")}
          />
        </ModuleField>
        <ModuleField
          id="rotacion-trabajo"
          label="Días de trabajo"
          error={error?.dias_trabajo}
        >
          <Input
            id="rotacion-trabajo"
            type="number"
            min={1}
            {...register("patron_rotacion.dias_trabajo", {
              valueAsNumber: true,
            })}
          />
        </ModuleField>
        <ModuleField
          id="rotacion-descanso"
          label="Días de descanso"
          error={error?.dias_descanso}
        >
          <Input
            id="rotacion-descanso"
            type="number"
            min={1}
            {...register("patron_rotacion.dias_descanso", {
              valueAsNumber: true,
            })}
          />
        </ModuleField>
      </div>
      <Controller
        name="patron_rotacion.frecuencia_cambio"
        control={control}
        render={({ field }) => (
          <JornadaChoiceGroup
            label="Frecuencia de rotación"
            value={field.value ?? "SEMANAL"}
            items={enumItems(["SEMANAL", "QUINCENAL", "MENSUAL"])}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="patron_rotacion.turnos_base"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <p className="text-xs font-medium">Turnos base *</p>
            <div
              role="group"
              aria-label="Turnos base"
              className="flex flex-wrap gap-2"
            >
              {enumItems(["MANANA", "TARDE", "NOCHE", "MIXTO"]).map((item) => (
                <Button
                  key={item.value}
                  size="sm"
                  type="button"
                  variant="outline"
                  aria-pressed={field.value?.includes(item.value) ?? false}
                  className={
                    field.value?.includes(item.value)
                      ? "border-primary bg-primary/5 text-primary"
                      : ""
                  }
                  onClick={() =>
                    field.onChange(
                      field.value?.includes(item.value)
                        ? field.value.filter((value) => value !== item.value)
                        : [...(field.value ?? []), item.value],
                    )
                  }
                >
                  {item.label}
                </Button>
              ))}
            </div>
            {error?.turnos_base && (
              <p role="alert" className="text-xs text-destructive">
                {error.turnos_base.message}
              </p>
            )}
          </div>
        )}
      />
    </fieldset>
  );
}
