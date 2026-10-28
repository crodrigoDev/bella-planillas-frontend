import type { SelectOption } from "@/lib/types/options.types";

/**
 * Opciones del filtro de estado (activo o inactivo) que comparten los listados
 *
 * @remarks
 * Los valores son el texto que viaja en la URL
 */
export const ACTIVO_FILTER_OPTIONS: SelectOption[] = [
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
];
