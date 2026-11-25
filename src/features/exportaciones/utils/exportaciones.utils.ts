import {
  CONCEPTOS_PLAME,
  ESTADO_CORREO_RESUMEN,
  ORDEN_ESTADOS_CORREO,
  TIPO_ARCHIVO_LABELS,
  TIPOS_EXPORTACION,
} from "../config/exportaciones.config";
import type {
  ArchivoExportacion,
  CorreoExportacion,
  EstadoCorreo,
  EstadoExportacion,
  TipoExportacionDisponible,
} from "../types/exportaciones.types";

const ESTADOS_FINALES: readonly EstadoExportacion[] = [
  "COMPLETADO",
  "PARCIAL",
  "FALLIDO",
];

const REGEX_CONCEPTO_PLAME =
  /El concepto\s+([a-z0-9_]+)\s+requiere clasificación/i;

/** Indica si la exportación ya llegó a un estado terminal */
export const esEstadoFinal = (estado: EstadoExportacion): boolean =>
  ESTADOS_FINALES.includes(estado);

/** Indica si la exportación finalizó con archivos disponibles para descargar */
export const tieneArchivos = (estado: EstadoExportacion): boolean =>
  estado === "COMPLETADO" || estado === "PARCIAL";

/** Obtiene el nombre legible del formato de exportación */
export const getTipoExportacionLabel = (tipo: string): string => {
  if (tipo in TIPOS_EXPORTACION) {
    return TIPOS_EXPORTACION[tipo as TipoExportacionDisponible].label;
  }

  return "Exportación";
};

/** Obtiene el nombre legible del tipo de archivo generado */
export const getTipoArchivoLabel = (tipo: ArchivoExportacion["tipo"]): string =>
  TIPO_ARCHIVO_LABELS[tipo];

/**
 * Traduce errores conocidos del generador a instrucciones claras para el contador
 *
 * @remarks
 * Depende del texto devuelto porque no existen códigos de error en la respuesta.
 */
export const traducirErrorExportacion = (
  error: string | null | undefined,
): string | null => {
  if (!error?.trim()) return null;

  const coincidencia = REGEX_CONCEPTO_PLAME.exec(error);
  if (coincidencia?.[1]) {
    const concepto = CONCEPTOS_PLAME.find(
      (item) => item.campo === coincidencia[1],
    );

    if (concepto) {
      return `Falta el código de la Tabla 22 para ${concepto.label}. Escríbelo en las opciones de PLAME y vuelve a generar.`;
    }
  }

  return error.trim();
};

/** Resumen agrupado de envíos de correo con etiqueta lista para mostrar */
export interface ResumenEstadoCorreo {
  estado: EstadoCorreo;
  textoResumen: string;
}

/**
 * Agrupa los correos de boletas por estado y genera su texto de resumen
 */
export const contarCorreosPorEstado = (
  correos: readonly CorreoExportacion[],
): ResumenEstadoCorreo[] => {
  const conteos = new Map<EstadoCorreo, number>();

  for (const correo of correos) {
    conteos.set(correo.estado, (conteos.get(correo.estado) ?? 0) + 1);
  }

  return ORDEN_ESTADOS_CORREO.flatMap((estado) => {
    const cantidad = conteos.get(estado) ?? 0;
    if (cantidad === 0) return [];

    const resumen = ESTADO_CORREO_RESUMEN[estado];
    const textoEstado = cantidad === 1 ? resumen.singular : resumen.plural;

    return [
      {
        estado,
        textoResumen: `${cantidad} ${textoEstado}`,
      },
    ];
  });
};
