import type {
  DuracionJornada,
  ModalidadJornada,
  TurnoJornada,
} from "@jyp/shared-contracts";

import type { DiaSemana } from "../types/jornadas.types";

/** Turnos de una jornada */
export const TURNO_OPTIONS: { value: TurnoJornada; label: string }[] = [
  { value: "MANANA", label: "Mañana" },
  { value: "TARDE", label: "Tarde" },
  { value: "NOCHE", label: "Noche" },
  { value: "MIXTO", label: "Mixto" },
  { value: "ROTATIVO", label: "Rotativo" },
];

/** Modalidades de una jornada */
export const MODALIDAD_OPTIONS: { value: ModalidadJornada; label: string }[] = [
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "REMOTO", label: "Remoto" },
  { value: "HIBRIDO", label: "Híbrido" },
];

/** Duración de una jornada */
export const DURACION_OPTIONS: { value: DuracionJornada; label: string }[] = [
  { value: "TIEMPO_COMPLETO", label: "Tiempo completo" },
  { value: "TIEMPO_PARCIAL", label: "Tiempo parcial" },
];

/** Modalidad de un día concreto del horario (no admite híbrido) */
export const MODALIDAD_DIA_OPTIONS: {
  value: "PRESENCIAL" | "REMOTO";
  label: string;
}[] = [
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "REMOTO", label: "Remoto" },
];

/** Cada cuánto cambia el turno en una rotación */
export const FRECUENCIA_CAMBIO_OPTIONS = [
  { value: "SEMANAL", label: "Semanal" },
  { value: "QUINCENAL", label: "Quincenal" },
  { value: "MENSUAL", label: "Mensual" },
] as const;

/** Turnos que se pueden combinar en una rotación (el backend recibe su código) */
export const TURNOS_BASE_OPTIONS: { value: string; label: string }[] = [
  { value: "MANANA", label: "Mañana" },
  { value: "TARDE", label: "Tarde" },
  { value: "NOCHE", label: "Noche" },
];

/** Los siete días en el orden del horario, con su nombre */
export const DIAS_SEMANA: { value: DiaSemana; label: string }[] = [
  { value: "LUNES", label: "Lunes" },
  { value: "MARTES", label: "Martes" },
  { value: "MIERCOLES", label: "Miércoles" },
  { value: "JUEVES", label: "Jueves" },
  { value: "VIERNES", label: "Viernes" },
  { value: "SABADO", label: "Sábado" },
  { value: "DOMINGO", label: "Domingo" },
];

/** Etiqueta de un turno por su código */
export const getTurnoLabel = (turno: string): string =>
  TURNO_OPTIONS.find((option) => option.value === turno)?.label ?? turno;

/** Etiqueta de una modalidad por su código */
export const getModalidadLabel = (modalidad: string): string =>
  MODALIDAD_OPTIONS.find((option) => option.value === modalidad)?.label ??
  modalidad;

/** Etiqueta de una duración por su código */
export const getDuracionLabel = (duracion: string): string =>
  DURACION_OPTIONS.find((option) => option.value === duracion)?.label ??
  duracion;

/** Máximo de horas efectivas de un día que acepta el backend */
export const MAX_HORAS_DIA = 8;

/** Máximo de horas semanales que acepta el backend */
export const MAX_HORAS_SEMANA = 48;

/** El tiempo parcial debe sumar menos de estas horas semanales */
export const LIMITE_HORAS_TIEMPO_PARCIAL = 30;

/** Horario con el que arranca una jornada nueva: lunes a viernes de 08:00 a 17:00 con refrigerio de 13:00 a 14:00 (8 h efectivas) */
export const HORARIO_DEFECTO = {
  entrada: "08:00",
  inicio_descanso: "13:00",
  fin_descanso: "14:00",
  salida: "17:00",
} as const;

/** Días laborables del horario por defecto */
export const DIAS_LABORABLES_DEFECTO: readonly DiaSemana[] = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
];
