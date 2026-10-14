import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CrearEmpleadoFormValues,
  EmpleadoTextFieldName,
} from "../../types/crear-empleado.types";

interface EmpleadoSelectFieldProps {
  name: EmpleadoTextFieldName;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  emptyLabel?: string;
  placeholder?: string;
  onValueChange?: (value: string | null) => void;
}

/** Conecta los Select de shadcn con los valores y errores del formulario */
export default function EmpleadoSelectField({
  name,
  label,
  options,
  required = false,
  disabled = false,
  emptyLabel,
  placeholder = "Selecciona una opción",
  onValueChange,
}: EmpleadoSelectFieldProps) {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<CrearEmpleadoFormValues>();
  const id = `empleado-${name}`;
  const items = emptyLabel
    ? [{ value: "sin_seleccionar", label: emptyLabel }, ...options]
    : options;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field data-invalid={Boolean(error)}>
          <FieldLabel htmlFor={id} className="text-xs">
            {label}
            {required && <span aria-hidden="true" className="text-destructive">*</span>}
          </FieldLabel>
          <Select
            name={field.name}
            items={items}
            value={field.value ?? (emptyLabel ? "sin_seleccionar" : "")}
            disabled={disabled || isSubmitting}
            onValueChange={(value) => {
              if (value === null) return;
              const nextValue = value === "sin_seleccionar" ? null : value;
              field.onChange(nextValue);
              onValueChange?.(nextValue);
            }}
          >
            <SelectTrigger
              id={id}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className="h-9 w-full min-w-0 bg-background text-xs"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError id={`${id}-error`} errors={[error]} className="text-xs" />
        </Field>
      )}
    />
  );
}
