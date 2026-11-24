import type { PlanillaResumenDto } from "@jyp/shared-contracts";
import type { PaginationMeta } from "@/lib/api/types/api.types";

/** Estados posibles de una planilla mensual */
export type EstadoPlanilla = PlanillaResumenDto["estado"];

/** Fila resumida del listado mensual de planillas */
export type PlanillaResumen = PlanillaResumenDto;

/**
 * Datos de cabecera guardados dentro del detalle interno de la planilla
 *
 * @remarks
 * No existe un contrato compartido para esta estructura: todos sus campos son
 * anulables por si faltan o cambia su forma en el servidor.
 */
export interface CabeceraPlanilla {
  nombre_completo: string | null;
  nro_documento: string | null;
  cargo: string | null;
  area: string | null;
  asignacion_familiar: boolean | null;
  regimen_pension: string | null;
}

/**
 * Detalle completo de una planilla mensual
 *
 * @remarks
 * Los montos llegan como texto decimal para conservar precisión; se convierten
 * con `Number()` al mostrarlos con `formatCurrency`.
 */
export interface PlanillaDetalle {
  id: string;
  empleado_id: string;
  periodo: string;
  dias_laborados: number;
  version: number;
  estado: EstadoPlanilla;
  comentarios: string | null;
  validado_por: string | null;
  validado_en: string | null;
  created_at: string;
  updated_at: string;
  tasa_afp_aplicada: string | null;
  snapshot_calculo: unknown;
  sueldo_base: string;
  asignacion_familia: string;
  horas_extras_25: string;
  horas_extras_35: string;
  recargo_nocturno: string;
  gratificacion: string;
  bonif_extraordinaria: string;
  bono_extraordinario: string;
  descuento_faltas: string;
  descuento_tardanzas: string;
  descuento_sin_goce: string;
  descuento_onp: string;
  descuento_afp_fondo: string;
  descuento_afp_seguro: string;
  descuento_afp_comision: string;
  descuento_quinta: string;
  descuento_adelanto: string;
  descuento_eps: string;
  descuento_autorizado: string;
  descuento_dso: string;
  aporte_essalud: string;
  aporte_vida_ley: string;
  total_ingresos: string;
  total_descuentos: string;
  neto_a_pagar: string;
}

/** Filtros del listado mensual de planillas */
export interface PlanillasFilters {
  periodo: string;
  page: number;
  limit: number;
}

/** Página de planillas con sus datos de paginación */
export interface PlanillasPage {
  items: PlanillaResumen[];
  pagination: PaginationMeta;
}

/** Estados del trabajo en segundo plano que calcula las planillas */
export type EstadoTrabajo =
  | "waiting"
  | "delayed"
  | "prioritized"
  | "active"
  | "completed"
  | "failed";

/** Avance numérico durante la ejecución del cálculo de planillas */
export interface AvanceTrabajo {
  total: number;
  procesados: number;
  correctos: number;
  fallidos: number;
}

/** Observación o fallo registrado para un colaborador durante la generación */
export interface ErrorGeneracion {
  empleado_id: string;
  detalle: string;
}

/** Resultado global al completar la generación de planillas */
export type EstadoResultadoGeneracion = "COMPLETADO" | "PARCIAL" | "FALLIDO";

/** Resumen final devuelto al terminar la generación de planillas */
export interface ResultadoGeneracion {
  estado: EstadoResultadoGeneracion;
  total: number;
  correctos: number;
  fallidos: number;
  errores: ErrorGeneracion[];
  errores_truncados: boolean;
}

/** Respuesta de consulta del avance de una generación de planillas */
export interface TrabajoPlanillas {
  trabajo_id: string;
  estado: EstadoTrabajo;
  progreso: number | AvanceTrabajo;
  resultado: ResultadoGeneracion | null;
  error: string | null;
}

/** Respuesta al solicitar el cálculo de planillas */
export interface SolicitudGeneracion {
  trabajo_id: string;
  estado: EstadoTrabajo;
  consulta: string;
}

/** Opción de colaborador para selectores y resolución de nombres */
export interface EmpleadoOpcion {
  id: string;
  nombreCompleto: string;
  documento?: string;
}
