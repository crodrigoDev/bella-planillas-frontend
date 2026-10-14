import { useFormContext, useWatch } from "react-hook-form";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moduleLabel } from "@/components/modules/module.utils";
import type { JornadaFormValues } from "../../types/jornadas.types";
import { getJornadaHorasDia } from "../../utils/jornada-form.utils";
import JornadaDayCard from "./JornadaDayCard";
import JornadaRotationFields from "./JornadaRotationFields";

/** Organiza el horario base y copia el lunes sin alterar los dias de descanso */
export default function JornadaScheduleFields() {
  const { control, getValues, setValue } = useFormContext<JornadaFormValues>();
  const horario = useWatch({ control, name: "horario_semanal" });
  const turno = useWatch({ control, name: "turno" });
  const modalidad = useWatch({ control, name: "modalidad" });
  const duracion = useWatch({ control, name: "duracion" });
  const total = Number(
    horario.reduce((sum, dia) => sum + getJornadaHorasDia(dia), 0).toFixed(2),
  );
  const copiarLunes = (): void => {
    const [lunes, ...dias] = getValues("horario_semanal");
    dias.forEach((dia, index) => {
      if (dia.laborable)
        setValue(
          `horario_semanal.${index + 1}`,
          { ...lunes, dia: dia.dia, laborable: true },
          { shouldDirty: true },
        );
    });
  };
  return (
    <div className="space-y-5">
      <header className="border-b pb-4">
        <h2 className="text-sm font-semibold">
          {turno === "ROTATIVO"
            ? "Horario base y rotación"
            : "Horario semanal fijo"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {moduleLabel(duracion ?? "TIEMPO_COMPLETO")} ·{" "}
          {moduleLabel(turno ?? "MANANA")} ·{" "}
          {moduleLabel(modalidad ?? "PRESENCIAL")}
        </p>
      </header>
      {turno === "ROTATIVO" && <JornadaRotationFields />}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/15 bg-primary/[0.02] p-3">
        <p className="text-[11px] text-muted-foreground">
          Configura el lunes y aplica el mismo horario a los días laborables
        </p>
        <Button type="button" size="sm" variant="outline" onClick={copiarLunes}>
          <Copy aria-hidden className="size-3.5" />
          Copiar lunes a días laborables
        </Button>
      </div>
      <div className="space-y-3">
        {horario.map((dia, index) => (
          <JornadaDayCard key={dia.dia} index={index} />
        ))}
      </div>
      <p className="text-right text-xs font-medium">
        Total semanal: <span className="text-primary">{total} h</span>
      </p>
    </div>
  );
}
