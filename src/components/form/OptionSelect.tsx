import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterOption } from "@/lib/types/filters.types";

interface OptionSelectProps {
  id: string;
  options: FilterOption[];
  /** Valor elegido; undefined significa que aún no se eligió nada */
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder: string;
  /** Mientras las opciones se cargan */
  isLoading?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}

/**
 * Selector de una opción obligatoria para formularios
 *
 * @remarks
 * A diferencia de `FilterSelect`, no tiene una opción para quitar la
 * selección: sirve para campos que deben tener un valor.
 */
export function OptionSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  isLoading = false,
  invalid = false,
  disabled = false,
}: OptionSelectProps) {
  const items: FilterOption[] = [...options];

  // El valor puede existir antes de que lleguen las opciones (borrador guardado)
  if (value && !options.some((option) => option.value === value))
    items.push({
      value,
      label: isLoading ? "Cargando..." : "Opción no disponible",
    });

  return (
    <Select
      items={items}
      value={value ?? null}
      onValueChange={(next) => {
        if (next !== null) onChange(next);
      }}
      disabled={disabled}
    >
      <SelectTrigger id={id} aria-invalid={invalid} className="w-full">
        <SelectValue placeholder={isLoading ? "Cargando..." : placeholder} />
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
