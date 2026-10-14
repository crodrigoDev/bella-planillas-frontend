import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { JornadaFormValues } from "../types/jornadas.types";
import { Input } from "@/components/ui/input";
import { moduleLabel } from "@/components/modules/module.utils";
import ModuleSelect from "@/components/modules/ModuleSelect";

const horas = ["entrada", "inicio_descanso", "fin_descanso", "salida"] as const;
const nombres = ["Entrada", "Inicio de descanso", "Fin de descanso", "Salida"];

/** Configura cada dia en una fila sin agregar pasos al formulario */
export default function JornadaHorarioFields() {
  const { register, getValues, control } = useFormContext<JornadaFormValues>();
  const modalidad = useWatch({ control, name: "modalidad" });
  return (
    <fieldset className="space-y-3 rounded-lg border p-3">
      <legend className="px-1 text-xs font-medium">Horario semanal</legend>
      <p className="text-xs text-muted-foreground">
        Marca los días laborables y completa sus horas. El descanso es opcional.
      </p>
      {getValues("horario_semanal").map((dia, index) => (
        <div
          key={dia.dia}
          className="grid gap-2 rounded-md bg-muted/30 p-2 sm:grid-cols-[110px_repeat(4,1fr)]"
        >
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              {...register(`horario_semanal.${index}.laborable`)}
            />
            {moduleLabel(dia.dia)}
          </label>
          {horas.map((hora, hourIndex) => (
            <label
              key={hora}
              className="space-y-1 text-[10px] text-muted-foreground"
            >
              <span>{nombres[hourIndex]}</span>
              <Input
                aria-label={`${nombres[hourIndex]} ${moduleLabel(dia.dia)}`}
                type="time"
                className="h-8 bg-background text-xs"
                {...register(`horario_semanal.${index}.${hora}`, {
                  setValueAs: (value) => value || null,
                })}
              />
            </label>
          ))}
          {modalidad === "HIBRIDO" && (
            <div className="sm:col-span-5">
              <Controller
                name={`horario_semanal.${index}.modalidad`}
                control={control}
                render={({ field }) => (
                  <ModuleSelect
                    label={`Modalidad ${moduleLabel(dia.dia)}`}
                    value={field.value ?? "PRESENCIAL"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    items={[
                      { value: "PRESENCIAL", label: "Presencial" },
                      { value: "REMOTO", label: "Remoto" },
                    ]}
                  />
                )}
              />
            </div>
          )}
        </div>
      ))}
    </fieldset>
  );
}
