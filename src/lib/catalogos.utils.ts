import type { SelectOption } from "@/lib/types/options.types";

/** Máximo de registros que permite el backend por página */
export const CATALOGO_LIMIT = 100;

/**
 * Convierte los registros de un catálogo del backend en opciones para un Select
 */
export const toOptions = (
  items: { id: string; nombre: string }[],
): SelectOption[] => items.map(({ id, nombre }) => ({ value: id, label: nombre }));

/**
 * Busca el texto de una opción a partir de su valor
 *
 * @returns El texto de la opción; si no está en la lista, el mismo valor
 */
export const getOptionLabel = (
  options: SelectOption[] | undefined,
  value: string | null | undefined,
): string =>
  value ? (options?.find((option) => option.value === value)?.label ?? value) : "--";
