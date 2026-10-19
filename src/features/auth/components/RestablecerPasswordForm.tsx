import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  RestablecerFormSchema,
  type RestablecerFormValues,
} from "@/features/auth/schemas/auth.schema";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { KeyRound } from "lucide-react";

interface RestablecerPasswordFormProps {
  onSubmit: (values: RestablecerFormValues) => Promise<void>;
}

/** Valida la nueva contraseña y su confirmación, y las entrega a la página */
export default function RestablecerPasswordForm({
  onSubmit,
}: RestablecerPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RestablecerFormValues>({
    resolver: zodResolver(RestablecerFormSchema),
    defaultValues: { nueva_password: "", confirmar_password: "" },
    mode: "onTouched",
  });

  // Espera la peticion para mantener deshabilitado el formulario mientras envia
  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form noValidate onSubmit={submit}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.nueva_password)}>
          <FieldLabel htmlFor="restablecer-password" className="text-xs">
            Nueva Contraseña
          </FieldLabel>

          <PasswordInput
            {...register("nueva_password")}
            id="restablecer-password"
            autoComplete="new-password"
            placeholder="Mínimo 12 caracteres"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.nueva_password)}
          />

          <FieldError
            id="restablecer-password-error"
            errors={[errors.nueva_password]}
          />
        </Field>

        <Field data-invalid={Boolean(errors.confirmar_password)}>
          <FieldLabel htmlFor="restablecer-confirmar" className="text-xs">
            Confirmar contraseña
          </FieldLabel>

          <PasswordInput
            {...register("confirmar_password")}
            id="restablecer-confirmar"
            autoComplete="new-password"
            placeholder="Repite la contraseña"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.confirmar_password)}
          />

          <FieldError
            id="restablecer-confirmar-error"
            errors={[errors.confirmar_password]}
          />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
          {isSubmitting ? (
            <>
              <Spinner />
              Guardando…
            </>
          ) : (
            <>
              Cambiar contraseña
              <KeyRound aria-hidden="true" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
