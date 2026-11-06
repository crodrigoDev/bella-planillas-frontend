const KB = 1024;
const MB = 1024 * KB;

/**
 * Reglas para revisar un archivo antes de enviarlo
 *
 * @remarks
 * Se pide al menos `tipos` o `extensiones`. Si se dan los dos, basta que cumpla uno.
 */
export interface ReglasArchivo {
  /** Tipos MIME permitidos (`file.type`) */
  tipos?: readonly string[];
  /** Extensiones permitidas con el punto, por ejemplo `".xlsx"` */
  extensiones?: readonly string[];
  /** Tamaño máximo en bytes */
  maxBytes: number;
  /** Cómo se nombra el tipo permitido, por ejemplo `"un PDF"` */
  descripcionTipo: string;
  /** Sujeto del mensaje de tamaño; por defecto `"El archivo"` */
  nombre?: string;
}

/**
 * Convierte bytes en un texto para mostrar
 *
 * @returns Por ejemplo `"5 MB"` o `"512 KB"`
 */
export const formatBytes = (bytes: number): string =>
  bytes >= MB
    ? `${Number((bytes / MB).toFixed(1))} MB`
    : `${Math.ceil(bytes / KB)} KB`;

/**
 * Revisa el tipo y el tamaño de un archivo
 *
 * @returns El mensaje de error, o `null` si no hay archivo o cumple las reglas
 */
export const getArchivoError = (
  file: File | null,
  reglas: ReglasArchivo,
): string | null => {
  if (!file) return null;

  const nombreArchivo = file.name.toLowerCase();
  const tipoValido =
    reglas.tipos?.includes(file.type) ||
    reglas.extensiones?.some((extension) => nombreArchivo.endsWith(extension));

  if (!tipoValido) return `El archivo debe ser ${reglas.descripcionTipo}.`;

  if (file.size > reglas.maxBytes)
    return `${reglas.nombre ?? "El archivo"} no puede superar los ${formatBytes(reglas.maxBytes)}.`;

  return null;
};
