import type { ReactNode } from "react";
import { get, useFormContext, useFormState } from "react-hook-form";

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
  /** Clases de la etiqueta, por ejemplo `text-xs` en los formularios de acceso */
  labelClassName?: string;
  /** Elemento a la derecha de la etiqueta, por ejemplo un enlace o "Requerido" */
  labelAside?: ReactNode;
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
  labelClassName,
  labelAside,
  children,
}: FormFieldProps) {
  // Se suscribe al error de este campo: no depende de que el formulario padre
  // se vuelva a renderizar cuando cambian los errores
  const { control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const error = get(errors, name);

  const etiqueta = (
    <FieldLabel htmlFor={name} className={labelClassName}>
      {label} {required && <RequiredMark />}
    </FieldLabel>
  );

  return (
    <Field className={className}>
      {labelAside ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {etiqueta}
          {labelAside}
        </div>
      ) : (
        etiqueta
      )}
      {children(Boolean(error))}
      <FieldError errors={[error]} />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
