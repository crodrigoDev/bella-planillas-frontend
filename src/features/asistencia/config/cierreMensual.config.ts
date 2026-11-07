import type { SelectOption } from "@/lib/types/options.types";
import type { EstadoResumen } from "../types/asistencia.types";
import { ESTADO_RESUMEN } from "./asistencia.config";

/** Opciones del filtro de estado del cierre mensual */
export const ESTADO_RESUMEN_OPTIONS: SelectOption[] = (
  Object.keys(ESTADO_RESUMEN) as EstadoResumen[]
).map((estado) => ({ value: estado, label: ESTADO_RESUMEN[estado].label }));

/** Máximo de pendientes que el backend aprueba de una vez; con más hay que aprobar por colaborador */
export const MAX_APROBACION_MES = 100;
