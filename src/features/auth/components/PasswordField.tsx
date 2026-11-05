import type { ComponentProps, ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/features/auth/components/PasswordInput";

interface PasswordFieldProps
  extends Omit<ComponentProps<typeof PasswordInput>, "name" | "id"> {
  name: string;
  label: string;
  /** Elemento a la derecha de la etiqueta, por ejemplo "¿Olvidaste tu contraseña?" */
  labelAside?: ReactNode;
}

/**
 * Campo de contraseña (con botón para mostrarla) enlazado al formulario
 *
 * @remarks
 * Usa la etiqueta pequeña de los formularios de acceso. Debe ir dentro de un `FormProvider`.
 */
export function PasswordField({
  name,
  label,
  labelAside,
  ...inputProps
}: PasswordFieldProps) {
  const { register } = useFormContext();

  return (
    <FormField
      name={name}
      label={label}
      labelClassName="text-xs"
      labelAside={labelAside}
    >
      {(invalid) => (
        <PasswordInput
          id={name}
          aria-invalid={invalid}
          {...inputProps}
          {...register(name)}
        />
      )}
    </FormField>
  );
}
