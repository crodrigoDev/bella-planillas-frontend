import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterOption } from "@/lib/types/filters.types";

interface FilterSelectProps {
  ariaLabel: string;
  allLabel: string;
  options: FilterOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  isLoading?: boolean;
}

// Valor interno de la opción "todos"; el filtro real queda en undefined
const ALL_VALUE = "todos";

/**
 * Selector de un filtro del listado con una opción para quitarlo
 */
export function FilterSelect({
  ariaLabel,
  allLabel,
  options,
  value,
  onChange,
  isLoading = false,
}: FilterSelectProps) {
  const items: FilterOption[] = [
    { value: ALL_VALUE, label: allLabel },
    ...options,
  ];

  // El valor puede llegar de la url antes de que lleguen las opciones
  // o apuntar a un registro que ya no está activo
  if (value && !options.some((option) => option.value === value))
    items.push({
      value,
      label: isLoading ? "Cargando..." : "Opción no disponible",
    });

  return (
    <Select
      items={items}
      value={value ?? ALL_VALUE}
      onValueChange={(next) => {
        if (next === null) return;

        onChange(next === ALL_VALUE ? undefined : next);
      }}
    >
      <SelectTrigger aria-label={ariaLabel} className="w-full sm:w-48">
        <SelectValue />
      </SelectTrigger>

      <SelectContent alignItemWithTrigger={false}>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
