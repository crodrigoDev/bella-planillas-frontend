import type { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  EmpleadoFormValues,
  EmpleadoInputName,
} from "../../types/empleado-form.types";

interface EmpleadoInputFieldProps {
  name: EmpleadoInputName;
  label: string;
  required?: boolean;
  type?: ComponentProps<typeof Input>["type"];
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  inputMode?: ComponentProps<typeof Input>["inputMode"];
  className?: string;
  emptyValue?: null | "";
  disabled?: boolean;
}

/** Conecta un campo de texto con el formulario y muestra su error */
export default function EmpleadoInputField({
  name,
  label,
  required = false,
  className,
  emptyValue,
  disabled = false,
  ...inputProps
}: EmpleadoInputFieldProps) {
  const {
    register,
    getFieldState,
    formState,
  } = useFormContext<EmpleadoFormValues>();
  const id = `empleado-${name}`;
  const { error } = getFieldState(name, formState);
  const { isSubmitting } = formState;

  return (
    <Field data-invalid={Boolean(error)} className={className}>
      <FieldLabel htmlFor={id} className="text-xs">
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive">*</span>
        )}
      </FieldLabel>
      <Input
        {...register(name, {
          // Al editar, null borra el dato y undefined lo deja sin enviar
          setValueAs: (value: unknown) =>
            typeof value === "string" ? value.trim() || emptyValue : value,
        })}
        {...inputProps}
        id={id}
        disabled={disabled || isSubmitting}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-9 bg-background text-sm md:text-xs"
      />
      <FieldError id={`${id}-error`} errors={[error]} className="text-xs" />
    </Field>
  );
}
