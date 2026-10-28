import type { ReactNode } from "react";
import { get, useFormContext } from "react-hook-form";

import { RequiredMark } from "@/components/form/RequiredMark";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

interface FormFieldProps {
  /** Nombre del campo en el formulario; también se usa como `id` */
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  /** Para que el campo ocupe más columnas de la cuadrícula */
  className?: string;
  /** Recibe si el campo tiene error, para marcar el control como inválido */
  children: (invalid: boolean) => ReactNode;
}

/**
 * Campo de un formulario con etiqueta, control y mensaje de error
 *
 * @remarks
 * Debe usarse dentro de un `FormProvider`: lee el error del campo desde
 * el contexto del formulario.
 */
export function FormField({
  name,
  label,
  required = false,
  description,
  className,
  children,
}: FormFieldProps) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);

  return (
    <Field className={className}>
      <FieldLabel htmlFor={name}>
        {label} {required && <RequiredMark />}
      </FieldLabel>
      {children(Boolean(error))}
      <FieldError errors={[error]} />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
