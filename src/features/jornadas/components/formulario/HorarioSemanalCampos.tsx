import { CopyIcon } from "lucide-react";
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";

import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import { OptionSelect } from "@/components/form/OptionSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DIAS_SEMANA,
  MAX_HORAS_DIA,
  MODALIDAD_DIA_OPTIONS,
} from "../../config/jornadas.config";
import type { JornadaFormValues } from "../../schemas/jornada.schema";
import {
  calcularHorasDia,
  calcularHorasSemana,
  formatHoras,
} from "../../utils/jornadas.utils";

// Un campo de hora vacío no debe enviarse como texto vacío
const emptyToUndefined = (value: string) => value || undefined;

/** Campos de un día que "Copiar el lunes" pasa a los demás días laborables */
const CAMPOS_COPIABLES = [
  "modalidad",
  "entrada",
  "inicio_descanso",
  "fin_descanso",
  "salida",
] as const;

type CampoHora = "entrada" | "inicio_descanso" | "fin_descanso" | "salida";

/**
 * Tabla con el horario de los siete días y el total de horas de la semana
 *
 * @remarks
 * Las horas de cada día y el total se calculan en vivo con la misma fórmula
 * del backend. Los campos de un día no laborable quedan bloqueados, pero
 * conservan lo escrito por si se vuelve a marcar.
 */
export function HorarioSemanalCampos() {
  const { control, getValues, setValue } = useFormContext<JornadaFormValues>();
  const dias = useWatch({ control, name: "horario_semanal" });
  const modalidadJornada = useWatch({ control, name: "modalidad" });
  const { errors } = useFormState({ control, name: "horario_semanal" });

  const copiarLunes = () => {
    const lunes = getValues("horario_semanal.0");

    DIAS_SEMANA.forEach((_, index) => {
      if (index === 0 || !getValues(`horario_semanal.${index}.laborable`))
        return;

      CAMPOS_COPIABLES.forEach((campo) =>
        setValue(`horario_semanal.${index}.${campo}`, lunes[campo], {
          shouldDirty: true,
        }),
      );
    });
  };

  const rootError = errors.horario_semanal?.root?.message;

  return (
    <div className="col-span-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Las horas efectivas son la salida menos la entrada y el refrigerio.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={copiarLunes}>
          <CopyIcon data-icon="inline-start" />
          Copiar el lunes a los días laborables
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Día</TableHead>
            <TableHead>Laborable</TableHead>
            <TableHead>Modalidad</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Inicio de refrigerio</TableHead>
            <TableHead>Fin de refrigerio</TableHead>
            <TableHead>Salida</TableHead>
            <TableHead className="text-right">Horas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DIAS_SEMANA.map(({ value, label }, index) => (
            <HorarioDiaFila
              key={value}
              index={index}
              label={label}
              modalidadJornada={modalidadJornada}
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7} className="font-medium">
              Total semanal
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatHoras(calcularHorasSemana(dias ?? []))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {rootError && (
        <p role="alert" className="text-sm text-destructive">
          {rootError}
        </p>
      )}
    </div>
  );
}

interface HorarioDiaFilaProps {
  /** Posición del día en el horario (0 = lunes) */
  index: number;
  label: string;
  /** Modalidad de la jornada: solo con híbrido se elige la de cada día */
  modalidadJornada: string | undefined;
}

/** Fila de un día: laborable, modalidad, las cuatro horas y las horas efectivas */
function HorarioDiaFila({
  index,
  label,
  modalidadJornada,
}: HorarioDiaFilaProps) {
  const { control, register } = useFormContext<JornadaFormValues>();
  const dia = useWatch({ control, name: `horario_semanal.${index}` });
  const { errors } = useFormState({
    control,
    name: `horario_semanal.${index}`,
  });
  const erroresDia = errors.horario_semanal?.[index];
  const laborable = Boolean(dia?.laborable);
  const horas = calcularHorasDia(dia ?? {});
  // Presencial o remoto fijan todos los días; híbrido deja elegir cada uno
  const modalidadFija = modalidadJornada !== "HIBRIDO";

  const renderHora = (campo: CampoHora, nombre: string) => {
    const error = erroresDia?.[campo];

    return (
      <div className="space-y-1">
        <Input
          type="time"
          aria-label={`${nombre} del ${label.toLowerCase()}`}
          aria-invalid={Boolean(error)}
          disabled={!laborable}
          className="min-w-28"
          {...register(`horario_semanal.${index}.${campo}`, {
            setValueAs: emptyToUndefined,
          })}
        />
        {error?.message && (
          <p role="alert" className="text-xs text-destructive">
            {error.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell>
        <input
          type="checkbox"
          aria-label={`${label} laborable`}
          className="size-4 accent-primary"
          {...register(`horario_semanal.${index}.laborable`)}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`horario_semanal.${index}.modalidad`}
          render={({ field }) => (
            <OptionSelect
              id={`horario_semanal.${index}.modalidad`}
              options={MODALIDAD_DIA_OPTIONS}
              value={modalidadFija ? modalidadJornada : field.value}
              onChange={field.onChange}
              placeholder="Modalidad"
              disabled={!laborable || modalidadFija}
            />
          )}
        />
      </TableCell>
      <TableCell>{renderHora("entrada", "Entrada")}</TableCell>
      <TableCell>
        {renderHora("inicio_descanso", "Inicio de refrigerio")}
      </TableCell>
      <TableCell>{renderHora("fin_descanso", "Fin de refrigerio")}</TableCell>
      <TableCell>{renderHora("salida", "Salida")}</TableCell>
      <TableCell
        className={
          horas > MAX_HORAS_DIA
            ? `text-right ${TONE_TEXT.danger}`
            : "text-right text-muted-foreground"
        }
      >
        {laborable ? formatHoras(horas) : "--"}
      </TableCell>
    </TableRow>
  );
}
