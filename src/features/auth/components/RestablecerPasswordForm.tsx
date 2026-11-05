import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";

import { LoadingButton } from "@/components/form/LoadingButton";
import { FieldGroup } from "@/components/ui/field";
import { PasswordField } from "@/features/auth/components/PasswordField";
import {
  RestablecerFormSchema,
  type RestablecerFormValues,
} from "@/features/auth/schemas/auth.schema";
import { zodResolverOptions } from "@/lib/zodMessages.utils";

interface RestablecerPasswordFormProps {
  onSubmit: (values: RestablecerFormValues) => Promise<void>;
}

/** Valida la nueva contraseña y su confirmación, y las entrega a la página */
export function RestablecerPasswordForm({
  onSubmit,
}: RestablecerPasswordFormProps) {
  const methods = useForm<RestablecerFormValues>({
    resolver: zodResolver(RestablecerFormSchema, zodResolverOptions),
    defaultValues: { nueva_password: "", confirmar_password: "" },
    mode: "onTouched",
  });
  const { isSubmitting } = methods.formState;

  // Espera la peticion para mantener deshabilitado el formulario mientras envia
  const submit = methods.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={submit}>
        <FieldGroup>
          <PasswordField
            name="nueva_password"
            label="Nueva Contraseña"
            autoComplete="new-password"
            placeholder="Mínimo 12 caracteres"
            disabled={isSubmitting}
          />

          <PasswordField
            name="confirmar_password"
            label="Confirmar contraseña"
            autoComplete="new-password"
            placeholder="Repite la contraseña"
            disabled={isSubmitting}
          />

          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Guardando…"
            icon={KeyRound}
            className="h-10 w-full"
          >
            Cambiar contraseña
          </LoadingButton>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
