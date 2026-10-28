import { Controller, useFormContext } from "react-hook-form";

import { FilterSelect } from "@/components/filters/FilterSelect";
import { FormField } from "@/components/form/FormField";
import { OptionSelect } from "@/components/form/OptionSelect";
import type { FilterOption } from "@/lib/types/filters.types";

const NO_OPTIONS: FilterOption[] = [];

interface SelectFieldProps {
  name: string;
  label: string;
  required?: boolean;
  /** Mientras no lleguen, el selector queda vacío */
  options?: FilterOption[];
  placeholder?: string;
  isLoading?: boolean;
  description?: string;
  fieldClassName?: string;
  /**
   * Si se indica, el campo es opcional y esta es la opción para dejarlo
   * vacío (por ejemplo "Sin cuenta bancaria")
   */
  clearLabel?: string;
  /** Se ejecuta después de guardar el valor elegido */
  onValueChange?: (value: string | undefined) => void;
}

/**
 * Selector de una lista de opciones enlazado al formulario
 */
export function SelectField({
  name,
  label,
  required,
  options = NO_OPTIONS,
  placeholder = "Selecciona una opción",
  isLoading,
  description,
  fieldClassName,
  clearLabel,
  onValueChange,
}: SelectFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      description={description}
      className={fieldClassName}
    >
      {(invalid) => (
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const handleChange = (next: string | undefined) => {
              field.onChange(next);
              onValueChange?.(next);
            };

            return clearLabel ? (
              <FilterSelect
                id={name}
                ariaLabel={label}
                allLabel={clearLabel}
                options={options}
                value={field.value || undefined}
                onChange={handleChange}
                isLoading={isLoading}
                className="sm:w-full"
              />
            ) : (
              <OptionSelect
                id={name}
                options={options}
                value={field.value || undefined}
                onChange={handleChange}
                placeholder={placeholder}
                isLoading={isLoading}
                invalid={invalid}
              />
            );
          }}
        />
      )}
    </FormField>
  );
}
