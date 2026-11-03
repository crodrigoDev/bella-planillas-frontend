import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import { Textarea } from "@/components/ui/textarea";

interface MotivoFieldProps {
  name?: string;
  label?: string;
  placeholder?: string;
}

/**
 * Campo de texto largo para el motivo de un cambio
 *
 * @remarks
 * El backend pide un motivo (entre 5 y 1000 caracteres) en cada cambio de
 * asistencia, para dejar constancia. Debe usarse dentro de un `FormProvider`.
 */
export function MotivoField({
  name = "motivo",
  label = "Motivo",
  placeholder,
}: MotivoFieldProps) {
  const { register } = useFormContext();

  return (
    <FormField name={name} label={label} required className="col-span-full">
      {(invalid) => (
        <Textarea
          id={name}
          maxLength={1000}
          placeholder={placeholder}
          aria-invalid={invalid}
          {...register(name)}
        />
      )}
    </FormField>
  );
}
