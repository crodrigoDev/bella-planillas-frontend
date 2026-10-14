import { TipoMarcacion, type CrearContratoDto, type DiaHorarioDto } from "@jyp/shared-contracts";
import type { EstadoAsistenciaDia } from "../types/ficha-empleado.types";

// Fecha fija para que los datos de prueba y sus semanas sean consistentes
export const FICHA_FECHA_MOCK = "2026-10-14";

export const DIAS_JORNADA = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
} satisfies Record<DiaHorarioDto["dia"], string>;

export const MARCACIONES_COLUMNAS = [
  { tipo: TipoMarcacion.ENTRADA, label: "Entrada" },
  { tipo: TipoMarcacion.SALIDA_ALMUERZO, label: "Salida a almuerzo" },
  { tipo: TipoMarcacion.ENTRADA_ALMUERZO, label: "Regreso de almuerzo" },
  { tipo: TipoMarcacion.SALIDA, label: "Salida" },
];

export const ESTADOS_CONTRATO = {
  VIGENTE: { label: "Vigente", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  VENCIDO: { label: "Vencido", className: "border-amber-200 bg-amber-50 text-amber-700" },
  RENOVADO: { label: "Renovado", className: "border-blue-200 bg-blue-50 text-blue-700" },
  ANULADO: { label: "Anulado", className: "border-slate-200 bg-slate-100 text-slate-600" },
} satisfies Record<CrearContratoDto["estado"], { label: string; className: string }>;

export const MODALIDADES_JORNADA = { PRESENCIAL: "Presencial", REMOTO: "Remoto", HIBRIDO: "Híbrido" };

export const RESULTADOS_ASISTENCIA = {
  PUNTUAL: { label: "Puntual", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  TARDANZA: { label: "Tardanza", className: "border-amber-200 bg-amber-50 text-amber-700" },
  FALTA: { label: "Falta", className: "border-red-200 bg-red-50 text-red-700" },
  PENDIENTE: { label: "Pendiente", className: "border-slate-200 bg-slate-50 text-slate-500" },
  DESCANSO: { label: "Descanso", className: "border-slate-200 bg-slate-100 text-slate-600" },
  SIN_JORNADA: { label: "Sin jornada", className: "border-slate-200 bg-slate-50 text-slate-500" },
  FUERA_PERIODO: { label: "Fuera de período", className: "border-slate-200 bg-slate-50 text-slate-500" },
  JUSTIFICADO: { label: "Justificado", className: "border-blue-200 bg-blue-50 text-blue-700" },
} satisfies Record<EstadoAsistenciaDia, { label: string; className: string }>;
