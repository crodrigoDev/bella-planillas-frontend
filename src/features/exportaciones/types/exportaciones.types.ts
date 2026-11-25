import type {
  ArchivoIntegracionDto,
  ConfiguracionExportacionDto,
  ResultadoIntegracionDto,
  SolicitarExportacionDto,
} from "@jyp/shared-contracts";

/** Formatos de exportación habilitados en esta pantalla */
export type TipoExportacionDisponible = Extract<
  SolicitarExportacionDto["tipo"],
  "COSTOS" | "BOLETAS" | "PLAME"
>;

/** Concepto contable editable para la clasificación en PLAME */
export type CampoConceptoPlame = keyof NonNullable<
  ConfiguracionExportacionDto["conceptos_plame"]
>;

/** Archivo generado por una exportación */
export type ArchivoExportacion = ArchivoIntegracionDto;

/** Resultado final de una exportación con archivos, correos y posible aviso */
export type ResultadoExportacion = ResultadoIntegracionDto;

/** Registro del estado de envío de un correo de boleta */
export type CorreoExportacion = ResultadoExportacion["correos"][number];

/** Estado de envío de cada boleta por correo */
export type EstadoCorreo = CorreoExportacion["estado"];

/** Estado de ejecución de una exportación */
export type EstadoExportacion =
  | "PENDIENTE"
  | "PROCESANDO"
  | "COMPLETADO"
  | "PARCIAL"
  | "FALLIDO";

/** Respuesta inmediata al solicitar una exportación */
export interface SolicitudExportacion {
  id: string;
  tipo: string;
  estado: EstadoExportacion;
  periodo: string | null;
  creado_en: string;
}

/** Respuesta de consulta del avance y resultado de una exportación */
export interface Exportacion extends SolicitudExportacion {
  iniciado_en: string | null;
  finalizado_en: string | null;
  intentos: number;
  requiere_revision: boolean;
  resultado: ResultadoExportacion | null;
  error: string | null;
}
