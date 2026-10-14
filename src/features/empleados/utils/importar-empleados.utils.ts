import { IMPORTACION_COLUMNAS, IMPORTACION_MAX_BYTES } from "../config/importar-empleados.config";
import { getFilasImportacionMock } from "../data/importar-empleados.mock";
import type { ErrorImportacion, EscenarioImportacion } from "../types/importar-empleados.types";

/** Comprueba el formato, el tamaño y que se haya elegido un archivo con contenido */
export function getImportacionFileError(file: File): string | null {
  if (!/\.(xlsx|csv)$/i.test(file.name)) return "Selecciona un archivo Excel (.xlsx) o CSV (.csv)";
  if (!file.size) return "El archivo está vacío";
  if (file.size > IMPORTACION_MAX_BYTES) return "El archivo no puede superar los 50 MB";
  return null;
}

export function formatImportacionValor(value: unknown): string {
  if (value === undefined || value === null || value === "") return "Vacío";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

/** Mantiene comas, comillas y saltos de linea dentro de una celda CSV */
function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

/** Genera un archivo local de ejemplo con las columnas de la plantilla */
export function crearArchivoImportacionEjemplo(escenario: EscenarioImportacion): File {
  const filas = getFilasImportacionMock(escenario);
  const content = [
    IMPORTACION_COLUMNAS.map(csvCell).join(","),
    ...filas.map((fila) => IMPORTACION_COLUMNAS.map((key) => csvCell(fila[key])).join(",")),
  ].join("\r\n");
  return new File(["\uFEFF", content], `empleados_ejemplo_${escenario}.csv`, { type: "text/csv;charset=utf-8" });
}

/** Descarga el detalle de errores para revisarlo junto al archivo original */
export function descargarErroresImportacion(errores: ErrorImportacion[]): void {
  const content = [
    ["fila", "columna", "valor_recibido", "mensaje"].map(csvCell).join(","),
    ...errores.map((error) => [error.fila, error.columna, formatImportacionValor(error.valor_recibido), error.mensaje].map(csvCell).join(",")),
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "errores_importacion_empleados.csv";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
