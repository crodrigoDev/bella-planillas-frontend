import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatPeriodo,
  getPeriodoActual,
  shiftPeriodo,
} from "../utils/asistencia.utils";

interface SelectorMesProps {
  /** Mes mostrado como YYYY-MM */
  periodo: string;
  onChange: (periodo: string) => void;
  /** Primer mes que se puede ver (YYYY-MM); antes del ingreso no hay asistencia */
  periodoMinimo?: string;
}

/**
 * Selector de mes con flechas para ir al anterior y al siguiente
 *
 * @remarks
 * No deja pasar del mes actual (el backend no calcula asistencia futura) ni
 * ir antes del mes de ingreso del empleado.
 */
export function SelectorMes({
  periodo,
  onChange,
  periodoMinimo,
}: SelectorMesProps) {
  const esMesActual = periodo >= getPeriodoActual();
  const esPrimerMes = periodoMinimo !== undefined && periodo <= periodoMinimo;

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Mes anterior"
        disabled={esPrimerMes}
        onClick={() => onChange(shiftPeriodo(periodo, -1))}
      >
        <ChevronLeftIcon />
      </Button>

      <p
        aria-live="polite"
        className="min-w-40 px-2 text-center text-base font-semibold capitalize"
      >
        {formatPeriodo(periodo)}
      </p>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Mes siguiente"
        disabled={esMesActual}
        onClick={() => onChange(shiftPeriodo(periodo, 1))}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
