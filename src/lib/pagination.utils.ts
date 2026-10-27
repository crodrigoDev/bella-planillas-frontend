/** Elemento de una barra de paginación: un número de página o puntos suspensivos */
export type PageItem = number | "ellipsis";

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

/**
 * Calcula qué números de página mostrar en una barra de paginación
 *
 * @param currentPage - Página actual, empezando en 1
 * @param totalPages - Total de páginas
 * @param siblings - Páginas visibles a cada lado de la actual
 * @returns Números de página y puntos suspensivos, por ejemplo `[1, 2, 3, "ellipsis", 7]`
 *
 * @remarks
 * Siempre muestra la primera y la última página. La cantidad de elementos
 * visibles no cambia al pasar de página, así la barra no se mueve.
 */
export const getPageItems = (
  currentPage: number,
  totalPages: number,
  siblings = 1,
): PageItem[] => {
  // Primera, última, actual, sus vecinas y dos posibles puntos suspensivos
  const maxVisible = siblings * 2 + 5;

  if (totalPages <= maxVisible) return range(1, totalPages);

  const left = Math.max(currentPage - siblings, 1);
  const right = Math.min(currentPage + siblings, totalPages);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < totalPages - 1;
  const edgeCount = siblings * 2 + 3;

  if (!showLeftEllipsis)
    return [...range(1, edgeCount), "ellipsis", totalPages];

  if (!showRightEllipsis)
    return [1, "ellipsis", ...range(totalPages - edgeCount + 1, totalPages)];

  return [1, "ellipsis", ...range(left, right), "ellipsis", totalPages];
};
