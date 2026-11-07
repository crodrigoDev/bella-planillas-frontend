import { Controller, useFormContext } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import { OptionSelect } from "@/components/form/OptionSelect";
import { TextField } from "@/components/form/TextField";
import { Input } from "@/components/ui/input";
import {
  FRECUENCIA_CAMBIO_OPTIONS,
  TURNOS_BASE_OPTIONS,
} from "../../config/jornadas.config";
import type { JornadaFormValues } from "../../schemas/jornada.schema";

const NO_TURNOS: string[] = [];

/**
 * Campos del patrón de rotación; solo se muestran con turno rotativo
 *
 * @remarks
 * Los números se registran con `valueAsNumber` porque el esquema los pide como
 * número. La frecuencia arranca en "Semanal" y los turnos sin marcar.
 */
export function PatronRotacionCampos() {
  const { control, register } = useFormContext<JornadaFormValues>();

  return (
    <>
      <TextField
        name="patron_rotacion.tipo_ciclo"
        label="Ciclo"
        required
        placeholder="Ejemplo: 6x1"
        description="Días de trabajo por días de descanso."
      />

      <FormField
        name="patron_rotacion.dias_trabajo"
        label="Días de trabajo"
        required
      >
        {(invalid) => (
          <Input
            id="patron_rotacion.dias_trabajo"
            type="number"
            min={1}
            aria-invalid={invalid}
            {...register("patron_rotacion.dias_trabajo", {
              valueAsNumber: true,
            })}
          />
        )}
      </FormField>

      <FormField
        name="patron_rotacion.dias_descanso"
        label="Días de descanso"
        required
      >
        {(invalid) => (
          <Input
            id="patron_rotacion.dias_descanso"
            type="number"
            min={1}
            aria-invalid={invalid}
            {...register("patron_rotacion.dias_descanso", {
              valueAsNumber: true,
            })}
          />
        )}
      </FormField>

      <FormField
        name="patron_rotacion.frecuencia_cambio"
        label="Cambio de turno"
        required
      >
        {(invalid) => (
          <Controller
            control={control}
            name="patron_rotacion.frecuencia_cambio"
            defaultValue="SEMANAL"
            render={({ field }) => (
              <OptionSelect
                id="patron_rotacion.frecuencia_cambio"
                options={[...FRECUENCIA_CAMBIO_OPTIONS]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona una opción"
                invalid={invalid}
              />
            )}
          />
        )}
      </FormField>

      <FormField
        name="patron_rotacion.turnos_base"
        label="Turnos que rotan"
        required
        className="col-span-full"
      >
        {() => (
          <Controller
            control={control}
            name="patron_rotacion.turnos_base"
            defaultValue={NO_TURNOS}
            render={({ field }) => {
              const elegidos = field.value ?? NO_TURNOS;

              return (
                <div
                  role="group"
                  aria-label="Turnos que rotan"
                  className="flex flex-wrap gap-x-6 gap-y-2"
                >
                  {TURNOS_BASE_OPTIONS.map((turno) => (
                    <label
                      key={turno.value}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={elegidos.includes(turno.value)}
                        onChange={(event) =>
                          field.onChange(
                            event.target.checked
                              ? [...elegidos, turno.value]
                              : elegidos.filter(
                                  (actual) => actual !== turno.value,
                                ),
                          )
                        }
                      />
                      {turno.label}
                    </label>
                  ))}
                </div>
              );
            }}
          />
        )}
      </FormField>
    </>
  );
}
