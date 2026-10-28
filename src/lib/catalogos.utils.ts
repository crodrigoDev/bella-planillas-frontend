import type { FilterOption } from "@/lib/types/filters.types";

/** Máximo de registros que permite el backend por página */
export const CATALOGO_LIMIT = 100;

/**
 * Convierte los registros de un catálogo del backend en opciones para un Select
 */
export const toOptions = (
  items: { id: string; nombre: string }[],
): FilterOption[] => items.map(({ id, nombre }) => ({ value: id, label: nombre }));
