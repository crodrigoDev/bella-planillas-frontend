import { RESULTADOS_ASISTENCIA } from "@/features/empleados/config/ficha-empleado.config";
import type { EstadoAsistenciaRegistro } from "../types/asistencia-diaria.types";

export const ESTADOS_ASISTENCIA_DIARIA = {
  ...RESULTADOS_ASISTENCIA,
  INCOMPLETA: {
    label: "Incompleta",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  EN_CURSO: {
    label: "En curso",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
} satisfies Record<
  EstadoAsistenciaRegistro,
  { label: string; className: string }
>;

export const RESUMEN_ASISTENCIA = [
  { estado: "PUNTUAL", label: "Puntuales" },
  { estado: "TARDANZA", label: "Tardanzas" },
  { estado: "FALTA", label: "Faltas" },
  { estado: "INCOMPLETA", label: "Incompletas" },
  { estado: "EN_CURSO", label: "En curso" },
] satisfies { estado: EstadoAsistenciaRegistro; label: string }[];
