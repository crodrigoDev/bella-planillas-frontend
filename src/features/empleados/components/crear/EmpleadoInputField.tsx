import type { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  CrearEmpleadoFormValues,
  EmpleadoInputFieldName,
} from "../../types/crear-empleado.types";

interface EmpleadoInputFieldProps {
  name: EmpleadoInputFieldName;
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
}

/** Conecta un campo de texto con el formulario y muestra su error */
export default function EmpleadoInputField({
  name,
  label,
  required = false,
  className,
  ...inputProps
}: EmpleadoInputFieldProps) {
  const {
    register,
    getFieldState,
    formState,
  } = useFormContext<CrearEmpleadoFormValues>();
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
          // Los campos opcionales vacios no se envian como cadenas vacias
          setValueAs: (value: unknown) =>
            typeof value === "string" ? value.trim() || undefined : value,
        })}
        {...inputProps}
        id={id}
        disabled={isSubmitting}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-9 bg-background text-sm md:text-xs"
      />
      <FieldError id={`${id}-error`} errors={[error]} className="text-xs" />
    </Field>
  );
}
