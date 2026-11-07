import { Controller, useFormContext } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import type { ColaboradorOption } from "@/lib/types/options.types";
import { ColaboradorSelect } from "./ColaboradorSelect";

interface ColaboradorComboboxProps {
  name: string;
  label: string;
  required?: boolean;
  /** Resultado de la búsqueda vigente; lo trae la página */
  options: ColaboradorOption[];
  isLoading?: boolean;
  /** Se llama con el texto escrito cuando se deja de teclear */
  onSearchChange: (search: string) => void;
  placeholder?: string;
  fieldClassName?: string;
}

/**
 * Selector de colaborador con búsqueda, enlazado al formulario
 *
 * @remarks
 * Envuelve a `ColaboradorSelect` con `FormField` y `Controller`. Guarda en el
 * formulario solo el id. Debe usarse dentro de un `FormProvider`.
 */
export function ColaboradorCombobox({
  name,
  label,
  required,
  options,
  isLoading,
  onSearchChange,
  placeholder,
  fieldClassName,
}: ColaboradorComboboxProps) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={fieldClassName}
    >
      {(invalid) => (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <ColaboradorSelect
              id={name}
              value={field.value || undefined}
              // Al vaciar se guarda "" y no undefined, para que el esquema avise
              onChange={(value) => field.onChange(value ?? "")}
              options={options}
              isLoading={isLoading}
              onSearchChange={onSearchChange}
              placeholder={placeholder}
              invalid={invalid}
            />
          )}
        />
      )}
    </FormField>
  );
}
