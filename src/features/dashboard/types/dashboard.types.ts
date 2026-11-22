import type {
  DashboardRrhhResponseDto,
  SolicitudTramiteResumenDto,
} from "@jyp/shared-contracts";

import type { StatusTone } from "@/components/feedback/statusTone.config";

export type { DashboardRrhhResponseDto, SolicitudTramiteResumenDto };

/** Indicadores seleccionables en el gráfico semanal de asistencia */
export type IndicadorAsistencia = "puntuales" | "tardanzas" | "faltas";

/** Variación de un indicador respecto al periodo anterior */
export interface KpiDelta {
  texto: string;
  tone: StatusTone;
  tendencia: "sube" | "baja" | "igual";
}
