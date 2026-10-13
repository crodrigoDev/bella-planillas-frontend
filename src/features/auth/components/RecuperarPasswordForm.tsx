import { zodResolver } from "@hookform/resolvers/zod";
import {
  SolicitudRecuperacionSchema,
  type SolicitudRecuperacionDTO,
} from "@jyp/shared-contracts";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface RecuperarPasswordFormProps {
  onSubmit: (values: SolicitudRecuperacionDTO) => Promise<void>;
}

/** Valida el documento y entrega la solicitud a la página */
export default function RecuperarPasswordForm({
  onSubmit,
}: RecuperarPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SolicitudRecuperacionSchema),
    defaultValues: { nro_documento: "" },
    mode: "onTouched",
  });

  // Espera la petición para mantener deshabilitado el formulario mientras envia
  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form noValidate onSubmit={submit}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.nro_documento)}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="recuperar-documento" className="text-xs">
              Número de documento
            </FieldLabel>
            <span className="text-xs text-muted-foreground">Requerido</span>
          </div>

          <Input
            {...register("nro_documento")}
            id="recuperar-documento"
            className="h-10"
            type="text"
            placeholder="Ej. 12345678"
            autoComplete="username"
            autoCapitalize="characters"
            spellCheck={false}
            required
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.nro_documento)}
            aria-describedby={
              errors.nro_documento ? "recuperar-documento-error" : undefined
            }
          />

          <FieldError
            id="recuperar-documento-error"
            errors={[errors.nro_documento]}
          />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
          {isSubmitting ? (
            <>
              <Spinner />
              Enviando…
            </>
          ) : (
            <>
              Solicitar recuperación
              <Send aria-hidden="true" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
