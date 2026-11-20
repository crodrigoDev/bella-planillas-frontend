import type {
  CambioElemento,
  DetalleElemento,
  ValorCambio,
} from "../types/auditoria.types";

/** Cómo se muestran los cambios de una fila según su acción de negocio */
export type ModoCambios = "comparacion" | "valores" | "valoresPrevios";

/** Columna de la matriz de cambios de un campo lista */
export interface ColumnaMatriz {
  campo: string;
  etiqueta: string;
}

/** Fila de la matriz de cambios: un elemento con sus celdas indexadas por campo */
export interface FilaMatriz {
  elemento: string;
  etiqueta: string;
  celdas: Record<string, CambioElemento>;
}

/** Matriz armada a partir del detalle de un campo lista */
export interface MatrizCambios {
  columnas: ColumnaMatriz[];
  filas: FilaMatriz[];
}

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

/** Texto aclaratorio sobre los valores mostrados en creación o eliminación; null en comparación */
export const getTextoModo = (modo: ModoCambios): string | null => {
  if (modo === "valores")
    return "Registro nuevo: no tenía valores anteriores.";
  if (modo === "valoresPrevios")
    return "Registro eliminado: estos eran sus últimos valores.";

  return null;
};

/**
 * Arma las columnas y filas de la matriz de cambios de un campo lista
 *
 * @remarks
 * Respeta el orden en que llegan los elementos y sus campos del backend; cada
 * columna se registra la primera vez que aparece al recorrer los elementos.
 */
export const buildMatrizCambios = (detalle: DetalleElemento[]): MatrizCambios => {
  const columnas: ColumnaMatriz[] = [];
  const camposVistos = new Set<string>();

  const filas: FilaMatriz[] = detalle.map((elemento) => {
    const celdas: Record<string, CambioElemento> = {};

    for (const cambio of elemento.cambios) {
      if (!camposVistos.has(cambio.campo)) {
        camposVistos.add(cambio.campo);
        columnas.push({ campo: cambio.campo, etiqueta: cambio.etiqueta });
      }
      celdas[cambio.campo] = cambio;
    }

    return {
      elemento: elemento.elemento,
      etiqueta: elemento.etiqueta,
      celdas,
    };
  });

  return { columnas, filas };
};
