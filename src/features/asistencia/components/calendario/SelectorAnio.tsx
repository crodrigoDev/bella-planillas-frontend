import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ANIO_MINIMO,
  getAnioMaximoNavegable,
} from "../../config/calendario.config";

interface SelectorAnioProps {
  /** Año mostrado */
  anio: number;
  onChange: (anio: number) => void;
}

/**
 * Selector de año con flechas para ir al anterior y al siguiente
 *
 * @remarks
 * No deja bajar de 1992 (antes no hay registros de asistencia) ni pasar del
 * año siguiente al actual.
 */
export function SelectorAnio({ anio, onChange }: SelectorAnioProps) {
  const esPrimerAnio = anio <= ANIO_MINIMO;
  const esUltimoAnio = anio >= getAnioMaximoNavegable();

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Año anterior"
        disabled={esPrimerAnio}
        onClick={() => onChange(anio - 1)}
      >
        <ChevronLeftIcon />
      </Button>

      <p
        aria-live="polite"
        className="min-w-24 px-2 text-center text-base font-semibold"
      >
        {anio}
      </p>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Año siguiente"
        disabled={esUltimoAnio}
        onClick={() => onChange(anio + 1)}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
