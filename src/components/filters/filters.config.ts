import type { FilterOption } from "@/lib/types/filters.types";

/**
 * Opciones del filtro de estado (activo o inactivo) que comparten los listados
 *
 * @remarks
 * Los valores son el texto que viaja en la URL
 */
export const ACTIVO_FILTER_OPTIONS: FilterOption[] = [
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
];
