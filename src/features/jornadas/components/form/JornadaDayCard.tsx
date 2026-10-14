import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import ModuleField from "@/components/modules/ModuleField";
import { moduleLabel } from "@/components/modules/module.utils";
import type { JornadaFormValues } from "../../types/jornadas.types";
import { getJornadaHorasDia } from "../../utils/jornada-form.utils";
import JornadaChoiceGroup from "./JornadaChoiceGroup";

const horas = [
  { key: "entrada", label: "Entrada" },
  { key: "inicio_descanso", label: "Inicio de descanso" },
  { key: "fin_descanso", label: "Fin de descanso" },
  { key: "salida", label: "Salida" },
] as const;

/** Muestra las horas del dia solo cuando esta marcado como laborable */
export default function JornadaDayCard({ index }: { index: number }) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<JornadaFormValues>();
  const dia = useWatch({ control, name: `horario_semanal.${index}` });
  const modalidad = useWatch({ control, name: "modalidad" });
  const total = getJornadaHorasDia(dia);
  const error = errors.horario_semanal?.[index];
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center gap-3 bg-primary/[0.02] px-4 py-3">
        <Switch
          id={`dia-${index}`}
          checked={dia.laborable ?? false}
          onCheckedChange={(checked) =>
            setValue(`horario_semanal.${index}.laborable`, checked, {
              shouldDirty: true,
            })
          }
        />
        <label
          htmlFor={`dia-${index}`}
          className="min-w-20 text-xs font-medium"
        >
          {moduleLabel(dia.dia)}
        </label>
        {dia.laborable ? (
          <span className="text-[11px] text-muted-foreground">
            {total} h totales
          </span>
        ) : (
          <Badge variant="secondary" className="text-[10px]">
            Día de descanso
          </Badge>
        )}
      </div>
      {dia.laborable && (
        <div className="space-y-4 border-t px-4 py-4">
          {modalidad === "HIBRIDO" && (
            <Controller
              name={`horario_semanal.${index}.modalidad`}
              control={control}
              render={({ field }) => (
                <JornadaChoiceGroup
                  label={`Modalidad · ${moduleLabel(dia.dia)}`}
                  value={field.value ?? "PRESENCIAL"}
                  items={[
                    { value: "PRESENCIAL", label: "Presencial" },
                    { value: "REMOTO", label: "Remoto" },
                  ]}
                  onChange={field.onChange}
                />
              )}
            />
          )}
          <div className="grid items-start gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-5">
            {horas.map((hora) => (
              <ModuleField
                key={hora.key}
                id={`hora-${index}-${hora.key}`}
                label={hora.label}
                error={error?.[hora.key]}
              >
                <Input
                  id={`hora-${index}-${hora.key}`}
                  type="time"
                  className="h-9 bg-background text-xs"
                  {...register(`horario_semanal.${index}.${hora.key}`, {
                    setValueAs: (value) => value || null,
                  })}
                />
              </ModuleField>
            ))}
            <div className="space-y-2">
              <p className="text-xs font-medium">Total</p>
              <output className="inline-flex h-9 items-center rounded-md bg-primary/5 px-3 text-xs font-semibold text-primary">
                {total} h
              </output>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
