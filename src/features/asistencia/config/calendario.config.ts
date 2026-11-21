import type { StatusTone } from "@/components/feedback/statusTone.config";
import { getTodayIsoDate } from "@/lib/date.utils";
import type { SelectOption } from "@/lib/types/options.types";
import type { CalendarioOrigen } from "../types/calendario.types";

/** Primer año que acepta el backend: antes de 1992 no hay registros de asistencia */
export const ANIO_MINIMO = 1992;

/** Último año que acepta el backend */
export const ANIO_MAXIMO = 9998;

/** Año de hoy, el que se muestra por defecto */
export const getAnioActual = (): number =>
  Number(getTodayIsoDate().slice(0, 4));

/** Hasta qué año se puede avanzar con el selector: el siguiente al actual */
export const getAnioMaximoNavegable = (): number => getAnioActual() + 1;

/** Nombre y tono de cada origen de un día del calendario */
export const ORIGEN_DIA: Record<
  CalendarioOrigen,
  { label: string; tone: StatusTone }
> = {
  NACIONAL: { label: "Nacional", tone: "info" },
  ADICIONAL: { label: "Acordado", tone: "neutral" },
};

/** Opciones del filtro por origen; en plural porque se leen dentro del selector */
export const ORIGEN_DIA_OPTIONS: SelectOption[] = [
  { value: "NACIONAL", label: "Nacionales" },
  { value: "ADICIONAL", label: "Acordados" },
];
