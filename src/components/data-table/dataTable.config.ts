import { rowPaginationFeature, tableFeatures } from "@tanstack/react-table";

/**
 * Funciones de tanstack table que usan todas las tablas de la aplicación
 */
export const dataTableFeatures = tableFeatures({ rowPaginationFeature });

export type DataTableFeatures = typeof dataTableFeatures;
