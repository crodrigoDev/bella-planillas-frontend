import type { StatusTone } from "@/components/feedback/statusTone.config";
import type {
  ArchivoExportacion,
  CampoConceptoPlame,
  EstadoCorreo,
  EstadoExportacion,
  TipoExportacionDisponible,
} from "../types/exportaciones.types";

/** Etiqueta y descripción de cada formato disponible para el contador */
export const TIPOS_EXPORTACION: Record<
  TipoExportacionDisponible,
  { label: string; descripcion: string }
> = {
  COSTOS: {
    label: "Costos por área",
    descripcion:
      "Resumen del mes en CSV con ingresos, descuentos y aportes por área, para contabilidad.",
  },
  BOLETAS: {
    label: "Boletas por correo",
    descripcion:
      "Genera la boleta en PDF de cada colaborador y se la envía a su correo, protegida con su número de documento.",
  },
  PLAME: {
    label: "PLAME",
    descripcion:
      "Archivos de jornada y remuneraciones para importar en el PDT PLAME de SUNAT.",
  },
};

/** Orden en el que se ofrecen los formatos en el formulario */
export const TIPOS_EXPORTACION_OPCIONES: readonly {
  tipo: TipoExportacionDisponible;
  label: string;
  descripcion: string;
}[] = [
  { tipo: "COSTOS", ...TIPOS_EXPORTACION.COSTOS },
  { tipo: "BOLETAS", ...TIPOS_EXPORTACION.BOLETAS },
  { tipo: "PLAME", ...TIPOS_EXPORTACION.PLAME },
];

/** Etiqueta y tono de insignia para cada estado de exportación */
export const ESTADO_EXPORTACION_LABELS: Record<
  EstadoExportacion,
  { label: string; tone: StatusTone }
> = {
  PENDIENTE: { label: "En cola", tone: "neutral" },
  PROCESANDO: { label: "Generando", tone: "info" },
  COMPLETADO: { label: "Lista", tone: "success" },
  PARCIAL: { label: "Lista con observaciones", tone: "warning" },
  FALLIDO: { label: "No se pudo generar", tone: "danger" },
};

/** Etiquetas en singular y plural y tono para resumir los envíos de boletas */
export const ESTADO_CORREO_RESUMEN: Record<
  EstadoCorreo,
  { singular: string; plural: string; tone: StatusTone }
> = {
  ACEPTADO_SMTP: {
    singular: "enviado",
    plural: "enviados",
    tone: "success",
  },
  GUARDADO_LOCAL: {
    singular: "guardado sin enviar",
    plural: "guardados sin enviar",
    tone: "neutral",
  },
  INDETERMINADO: {
    singular: "sin confirmar",
    plural: "sin confirmar",
    tone: "warning",
  },
  FALLIDO: {
    singular: "no se pudo enviar",
    plural: "no se pudieron enviar",
    tone: "danger",
  },
};

/** Orden estable para mostrar el resumen de correos por estado */
export const ORDEN_ESTADOS_CORREO: readonly EstadoCorreo[] = [
  "ACEPTADO_SMTP",
  "GUARDADO_LOCAL",
  "INDETERMINADO",
  "FALLIDO",
];

/** Nombre legible de cada tipo MIME generado */
export const TIPO_ARCHIVO_LABELS: Record<ArchivoExportacion["tipo"], string> = {
  "text/csv": "CSV",
  "text/plain": "Texto",
  "application/pdf": "PDF",
  "message/rfc822": "Correo",
};

/** Conceptos que pueden requerir código de Tabla 22 en PLAME, en el orden de la planilla */
export const CONCEPTOS_PLAME: readonly {
  campo: CampoConceptoPlame;
  label: string;
}[] = [
  { campo: "recargo_nocturno", label: "Recargo nocturno" },
  { campo: "gratificacion", label: "Gratificación" },
  {
    campo: "bonif_extraordinaria",
    label: "Bonificación extraordinaria Ley 30334",
  },
  { campo: "bono_extraordinario", label: "Bono extraordinario" },
  { campo: "descuento_sin_goce", label: "Licencia sin goce" },
  { campo: "descuento_dso", label: "Descuento por descanso semanal" },
  { campo: "descuento_autorizado", label: "Descuento autorizado" },
  { campo: "descuento_eps", label: "EPS" },
];
