import { useSearchParams } from "react-router-dom";

import { applyParamChanges, type ParamChanges } from "@/lib/urlParams.utils";
import {
  ANIO_MAXIMO,
  ANIO_MINIMO,
  getAnioActual,
} from "../config/calendario.config";
import type {
  CalendarioFilters,
  CalendarioOrigen,
} from "../types/calendario.types";

/** Lee un año de la URL; fuera del rango que acepta el backend se ignora */
const parseAnio = (value: string | null): number | undefined => {
  const anio = Number(value);

  return Number.isInteger(anio) && anio >= ANIO_MINIMO && anio <= ANIO_MAXIMO
    ? anio
    : undefined;
};

/** Lee el origen de la URL; cualquier otro valor se ignora */
const parseOrigen = (value: string | null): CalendarioOrigen | undefined =>
  value === "NACIONAL" || value === "ADICIONAL" ? value : undefined;

/**
 * Lee los filtros del calendario de la URL y permite cambiarlos
 *
 * @returns Los filtros de la URL y las funciones para modificarlos
 *
 * @remarks
 * El año es obligatorio: sin uno válido en la URL se usa el actual (y no se
 * escribe en la URL). El origen se filtra en el cliente porque el backend
 * devuelve todo el año.
 */
export function useCalendarioFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CalendarioFilters = {
    anio: parseAnio(searchParams.get("anio")) ?? getAnioActual(),
    origen: parseOrigen(searchParams.get("origen")),
  };

  const updateParams = (changes: ParamChanges) => {
    setSearchParams((current) => applyParamChanges(current, changes));
  };

  const setAnio = (anio: number) => {
    updateParams({ anio: anio === getAnioActual() ? undefined : String(anio) });
  };

  const setOrigen = (origen: string | undefined) => {
    updateParams({ origen: parseOrigen(origen ?? null) });
  };

  return { filters, setAnio, setOrigen };
}
