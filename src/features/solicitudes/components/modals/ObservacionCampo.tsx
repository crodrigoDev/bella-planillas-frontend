import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import { Textarea } from "@/components/ui/textarea";

interface ObservacionCampoProps {
  name: string;
  label: string;
  /** Máximo de caracteres que acepta el backend */
  maxLength: number;
  required?: boolean;
  placeholder?: string;
  /** Clases de la cuadrícula (`col-span-full`) cuando está dentro de una `FormSection` */
  className?: string;
}

/**
 * Campo de texto largo para una observación o un motivo (modales de evaluación y formulario)
 *
 * @remarks
 * Debe usarse dentro de un `FormProvider`.
 */
export function ObservacionCampo({
  name,
  label,
  maxLength,
  required,
  placeholder,
  className,
}: ObservacionCampoProps) {
  const { register } = useFormContext();

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
    >
      {(invalid) => (
        <Textarea
          id={name}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={invalid}
          {...register(name)}
        />
      )}
    </FormField>
  );
}
