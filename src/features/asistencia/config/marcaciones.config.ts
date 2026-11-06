import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { StepperStep } from "@/components/stepper/Stepper";
import type { SelectOption } from "@/lib/types/options.types";

/** Pasos de la importación de marcaciones */
export const MARCACIONES_IMPORTACION_STEPS: readonly StepperStep[] = [
  { id: "archivo", label: "Archivo" },
  { id: "revision", label: "Revisión" },
];

/** Posición de cada paso en `MARCACIONES_IMPORTACION_STEPS` */
export const PASO_ARCHIVO = 0;
export const PASO_REVISION = 1;

/** Extensión que acepta el backend, en el formato del `accept` del input */
export const MARCACIONES_EXTENSION = ".xlsx";

/** Tamaño máximo del archivo */
export const MARCACIONES_MAX_BYTES = 2 * 1024 * 1024;

/** Máximo de filas del archivo */
export const MARCACIONES_MAX_FILAS = 5000;

/** Máximo de errores que devuelve el backend */
export const MARCACIONES_MAX_ERRORES = 100;

/** Columnas que debe tener el Excel, con lo que se espera en cada una */
export const MARCACIONES_COLUMNAS: readonly { nombre: string; detalle: string }[] =
  [
    { nombre: "nro_documento", detalle: "documento del colaborador" },
    { nombre: "fecha", detalle: "día de la marcación" },
    { nombre: "hora", detalle: "hora de la marcación" },
    {
      nombre: "tipo_marcacion",
      detalle: "ENTRADA, SALIDA, SALIDA_ALMUERZO o ENTRADA_ALMUERZO",
    },
  ];

/** Tipos de marcación por los que se puede filtrar el listado */
export const TIPO_MARCA_FILTRO_OPTIONS: SelectOption[] = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "SALIDA", label: "Salida" },
];

/**
 * Nombre y tono del método con el que se registró una marcación
 *
 * @remarks
 * `BIOMETRICO` es un alias de `BIOMETRICO_EXCEL`. Un método desconocido se
 * muestra con su texto y tono neutro (ver `getMetodoMarcacion`).
 */
export const METODO_MARCACION: Record<
  string,
  { label: string; tone: StatusTone }
> = {
  BIOMETRICO_EXCEL: { label: "Biométrico", tone: "info" },
  BIOMETRICO: { label: "Biométrico", tone: "info" },
  WEB: { label: "Web", tone: "neutral" },
  MANUAL: { label: "Manual", tone: "warning" },
};

/** Nombre y tono de un método de marcación; si no se conoce, el mismo texto en neutro */
export const getMetodoMarcacion = (
  metodo: string,
): { label: string; tone: StatusTone } =>
  METODO_MARCACION[metodo] ?? { label: metodo, tone: "neutral" };
