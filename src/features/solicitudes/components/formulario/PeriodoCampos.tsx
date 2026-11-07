import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/form/TextField";
import { Field } from "@/components/ui/field";
import {
  MAX_DIAS_VACACIONES,
  TIPOS_CON_DIAS,
  TIPOS_CON_HORAS,
} from "../../config/solicitudes.config";
import type { TipoSolicitud } from "../../types/solicitudes.types";

interface PeriodoCamposProps {
  tipo: TipoSolicitud;
  /** Si el permiso se pide por horas (un solo día) */
  porHoras: boolean;
}

/**
 * Fechas, horas y días de una solicitud que afecta la asistencia
 *
 * @remarks
 * Con permiso por horas se pide un solo día y el tramo de horas, y no hay días.
 * La cantidad de días se sugiere desde las fechas y se puede corregir. Debe
 * usarse dentro de un `FormProvider`.
 */
export function PeriodoCampos({ tipo, porHoras }: PeriodoCamposProps) {
  const { register } = useFormContext();
  const permiteHoras = TIPOS_CON_HORAS.includes(tipo);
  const horas = permiteHoras && porHoras;

  return (
    <>
      {permiteHoras && (
        <Field className="col-span-full">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              {...register("por_horas")}
            />
            Por horas (un solo día)
          </label>
        </Field>
      )}

      <TextField
        name="fecha_inicio"
        label={horas ? "Día" : "Fecha de inicio"}
        type="date"
        required
      />

      {horas ? (
        <>
          <TextField name="hora_inicio" label="Hora de inicio" type="time" required />
          <TextField name="hora_fin" label="Hora de fin" type="time" required />
        </>
      ) : (
        <TextField name="fecha_fin" label="Fecha de fin" type="date" required />
      )}

      {!horas && TIPOS_CON_DIAS.includes(tipo) && (
        <TextField
          name="dias_solicitados"
          label="Días solicitados"
          type="number"
          min={1}
          max={tipo === "VACACIONES" ? MAX_DIAS_VACACIONES : undefined}
          description="Se calcula con las fechas (cuenta todos los días); puedes corregirlo."
        />
      )}
    </>
  );
}
