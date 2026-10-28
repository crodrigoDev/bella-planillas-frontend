import type { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/ui/input";

// Un campo opcional vacío no debe enviarse como texto vacío
const emptyToUndefined = (value: string) => value || undefined;

interface TextFieldProps
  extends Omit<ComponentProps<"input">, "name" | "id" | "required"> {
  name: string;
  label: string;
  required?: boolean;
  /** Si está vacío se envía `undefined` en vez de texto vacío */
  optional?: boolean;
  description?: string;
  /** Clases de la cuadrícula (`sm:col-span-2`...) para el campo completo */
  fieldClassName?: string;
}

/**
 * Campo de texto (o fecha, correo, número...) enlazado al formulario
 */
export function TextField({
  name,
  label,
  required,
  optional = false,
  description,
  fieldClassName,
  ...inputProps
}: TextFieldProps) {
  const { register } = useFormContext();

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      description={description}
      className={fieldClassName}
    >
      {(invalid) => (
        <Input
          id={name}
          aria-invalid={invalid}
          {...inputProps}
          {...register(name, optional ? { setValueAs: emptyToUndefined } : {})}
        />
      )}
    </FormField>
  );
}
