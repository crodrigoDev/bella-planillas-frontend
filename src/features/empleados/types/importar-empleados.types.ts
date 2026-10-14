import type { CargaMasivaFilaDTO } from "@jyp/shared-contracts";

/** Error de una celda del reporte de prevalidacion */
export interface ErrorImportacion {
  fila: number;
  columna: string;
  valor_recibido: unknown;
  mensaje: string;
}

/** Campos que devuelve el caso de uso de validar carga masiva */
export interface ReporteImportacion {
  total_filas: number;
  filas_validas: number;
  // En el backend este valor cuenta los errores, no las filas distintas
  filas_invalidas: number;
  errores_detalle: ErrorImportacion[];
  filas_validas_data: CargaMasivaFilaDTO[];
}

export interface ConfirmarImportacionDto {
  filas_validas_data: CargaMasivaFilaDTO[];
}

/** Datos que devuelve la consulta de estado del trabajo */
export interface TrabajoImportacion {
  id: string;
  estado: "EN_COLA" | "PROCESANDO" | "COMPLETADO" | "FALLIDO";
  total_registros: number;
  procesados: number;
  fallidos: number;
  errores_detalle: { Dni: string; causa: string }[];
  updated_at: string;
}

export type EscenarioImportacion =
  | "correcto"
  | "validacion"
  | "parcial"
  | "fallido"
  | "sin_validas";
