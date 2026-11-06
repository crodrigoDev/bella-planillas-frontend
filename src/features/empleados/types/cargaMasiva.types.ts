import type { CargaMasivaFilaDTO } from "@jyp/shared-contracts";

/** Una celda del archivo que no pasó la validación */
export interface CargaMasivaErrorFila {
  /** Número de fila en el archivo (la 1 es el encabezado) */
  fila: number;
  columna: string;
  valor_recibido: unknown;
  mensaje: string;
}

/** Resultado de revisar el archivo, sin guardar nada */
export interface CargaMasivaPreValidacion {
  total_filas: number;
  filas_validas: number;
  filas_invalidas: number;
  errores_detalle: CargaMasivaErrorFila[];
  /** Filas listas para confirmar */
  filas_validas_data: CargaMasivaFilaDTO[];
}

/** Estados de un trabajo de importación; `COMPLETADO` y `FALLIDO` son finales */
export type CargaMasivaEstado =
  | "EN_COLA"
  | "PROCESANDO"
  | "COMPLETADO"
  | "FALLIDO";

/** Fila que no se pudo guardar al procesar el trabajo */
export interface CargaMasivaErrorTrabajo {
  Dni: string;
  causa: string;
}

/** Avance de un trabajo de importación */
export interface CargaMasivaTrabajo {
  id: string;
  estado: CargaMasivaEstado;
  total_registros: number;
  procesados: number;
  fallidos: number;
  errores_detalle: CargaMasivaErrorTrabajo[] | null;
  updated_at: string;
}
