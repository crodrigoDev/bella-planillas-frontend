import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SolicitudRecuperacionSchema,
  type SolicitudRecuperacionDTO,
} from "@jyp/shared-contracts";
import { Send } from "lucide-react";

import { LoadingButton } from "@/components/form/LoadingButton";
import { TextField } from "@/components/form/TextField";
import { FieldGroup } from "@/components/ui/field";
import { RequeridoTag } from "@/features/auth/components/RequeridoTag";
import { zodResolverOptions } from "@/lib/zodMessages.utils";

interface RecuperarPasswordFormProps {
  onSubmit: (values: SolicitudRecuperacionDTO) => Promise<void>;
}

/** Valida el documento y entrega la solicitud a la página */
export function RecuperarPasswordForm({
  onSubmit,
}: RecuperarPasswordFormProps) {
  const methods = useForm({
    resolver: zodResolver(SolicitudRecuperacionSchema, zodResolverOptions),
    defaultValues: { nro_documento: "" },
    mode: "onTouched",
  });
  const { isSubmitting } = methods.formState;

  // Espera la petición para mantener deshabilitado el formulario mientras envia
  const submit = methods.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={submit}>
        <FieldGroup>
          <TextField
            name="nro_documento"
            label="Número de documento"
            labelClassName="text-xs"
            labelAside={<RequeridoTag />}
            className="h-10"
            type="text"
            placeholder="Ej. 12345678"
            autoComplete="username"
            autoCapitalize="characters"
            spellCheck={false}
            disabled={isSubmitting}
          />

          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Enviando…"
            icon={Send}
            className="h-10 w-full"
          >
            Solicitar recuperación
          </LoadingButton>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
