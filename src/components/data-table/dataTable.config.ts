import { rowPaginationFeature, tableFeatures } from "@tanstack/react-table";

/**
 * Funciones de tanstack table que usan todas las tablas de la aplicación
 */
export const dataTableFeatures = tableFeatures({ rowPaginationFeature });

export type DataTableFeatures = typeof dataTableFeatures;

/**
 * Cantidades de filas por página que se pueden elegir en los listados
 *
 * @remarks
 * El backend acepta hasta 100 filas por página.
 */
export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;
