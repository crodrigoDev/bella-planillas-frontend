import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { parseIsoDate, toIsoDate } from "@/lib/date.utils";
import { formatDate } from "@/lib/format.utils";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  /** Fecha inicial (YYYY-MM-DD) */
  from: string | undefined;
  /** Fecha final (YYYY-MM-DD) */
  to: string | undefined;
  /** Se llama con el rango elegido; `undefined` en la fecha que falta */
  onChange: (from: string | undefined, to: string | undefined) => void;
  ariaLabel: string;
  placeholder?: string;
  className?: string;
}

/**
 * Selector de un rango de fechas con calendario de dos meses
 *
 * @remarks
 * Trabaja con textos `YYYY-MM-DD`, los mismos que guarda la URL. Se puede
 * elegir solo la fecha inicial; la final queda sin aplicar.
 */
export function DateRangeFilter({
  from,
  to,
  onChange,
  ariaLabel,
  placeholder = "Rango de fechas",
  className,
}: DateRangeFilterProps) {
  const selected: DateRange | undefined = from
    ? { from: parseIsoDate(from), to: parseIsoDate(to) }
    : undefined;

  const label = from
    ? `${formatDate(from)} - ${to ? formatDate(to) : "..."}`
    : placeholder;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="lg"
            aria-label={ariaLabel}
            className={cn(
              "justify-start font-normal",
              !from && "text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarIcon data-icon="inline-start" />
        {label}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          locale={es}
          numberOfMonths={2}
          defaultMonth={parseIsoDate(from)}
          selected={selected}
          onSelect={(range) =>
            onChange(
              range?.from && toIsoDate(range.from),
              range?.to && toIsoDate(range.to),
            )
          }
        />
      </PopoverContent>
    </Popover>
  );
}
