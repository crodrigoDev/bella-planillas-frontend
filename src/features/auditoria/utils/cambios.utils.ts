import type { ValorCambio } from "../types/auditoria.types";

/** Cómo se muestran los cambios de una fila según su acción de negocio */
export type ModoCambios = "comparacion" | "valores" | "valoresPrevios";

/**
 * Elige cómo mostrar los cambios según la acción de negocio (`accion_etiqueta`)
 *
 * @remarks
 * En una creación solo hay valor posterior y en una eliminación solo el previo:
 * una columna "Antes" o "Después" vacía no dice nada.
 */
export const getModoCambios = (accionEtiqueta: string): ModoCambios => {
  if (accionEtiqueta === "Creación") return "valores";
  if (accionEtiqueta === "Eliminación") return "valoresPrevios";

  return "comparacion";
};

/** Texto de un valor ya legible del backend; sin valor es "--" */
export const formatValorActividad = (valor: ValorCambio | undefined): string => {
  if (valor === null || valor === undefined || valor === "") return "--";
  if (typeof valor === "boolean") return valor ? "Sí" : "No";

  return String(valor);
};

/** Texto de un campo protegido: nunca se muestra su valor */
export const getTextoProtegido = (modo: ModoCambios): string => {
  if (modo === "valores") return "Registrado (valor protegido)";
  if (modo === "valoresPrevios") return "Eliminado (valor protegido)";

  return "Modificado (valor protegido)";
};
