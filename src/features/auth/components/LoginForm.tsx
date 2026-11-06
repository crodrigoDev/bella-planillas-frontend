import { Link } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginDTO, LoginSchema } from "@jyp/shared-contracts";
import { ArrowRight } from "lucide-react";

import { ROUTE_PATHS } from "@/app/routes/path";
import { FormField } from "@/components/form/FormField";
import { LoadingButton } from "@/components/form/LoadingButton";
import { FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { PasswordField } from "@/features/auth/components/PasswordField";
import { RequeridoTag } from "@/features/auth/components/RequeridoTag";
import { TIPOS_DOCUMENTOS } from "@/features/auth/data/tipoDocumentos.data";
import { zodResolverOptions } from "@/lib/zodMessages.utils";

interface LoginFormProps {
  onSubmit?: (values: LoginDTO) => void | Promise<void>;
}

/**
 * Captura y valida las credenciales de acceso mediante el contrato compartido
 *
 * @remarks
 * Delega la autenticación al callback `onSubmit`.
 * Si no se proporciona, valida los campos sin hacer una petición.
 */
export function LoginForm({ onSubmit }: LoginFormProps) {
  const methods = useForm({
    resolver: zodResolver(LoginSchema, zodResolverOptions),
    defaultValues: {
      tipo_documento: "DNI",
      nro_documento: "",
      password: "",
    },
    mode: "onTouched",
  });
  const {
    handleSubmit,
    register,
    control,
    trigger,
    formState: { errors, isSubmitting, touchedFields, isSubmitted },
  } = methods;

  // handleSubmit valida primero, esperar el callback mantiene el estado de
  // isSubmitting activo mientras termina la operación del componente padre
  const submit = handleSubmit(async (values) => {
    await onSubmit?.(values);
  });

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={submit}>
        <FieldGroup>
          {/* El tipo y el número de documento son un solo control: se escribe a mano */}
          <FormField
            name="nro_documento"
            label="Número de documento"
            labelClassName="text-xs"
            labelAside={<RequeridoTag />}
          >
            {(invalid) => (
              <>
                <InputGroup className="h-10">
                  <InputGroupInput
                    {...register("nro_documento")}
                    id="nro_documento"
                    type="text"
                    placeholder="Ej. 12345678"
                    autoComplete="username"
                    autoCapitalize="characters"
                    spellCheck={false}
                    disabled={isSubmitting}
                    aria-invalid={invalid}
                  />

                  <InputGroupAddon align="inline-start" className="py-0">
                    <Controller
                      name="tipo_documento"
                      control={control}
                      render={({ field }) => (
                        <Select
                          name={field.name}
                          items={TIPOS_DOCUMENTOS}
                          value={field.value ?? "DNI"}
                          disabled={isSubmitting}
                          onValueChange={(value) => {
                            if (value === null) return;

                            field.onChange(value);

                            // El tipo seleccionado cambia las reglas de validación del número de documento
                            // Actualiza el error cuando el campo fue visitado o se intentó enviar
                            if (touchedFields.nro_documento || isSubmitted)
                              void trigger("nro_documento");
                          }}
                        >
                          <SelectTrigger
                            ref={field.ref}
                            onBlur={field.onBlur}
                            aria-label="Tipo de documento"
                            aria-invalid={Boolean(errors.tipo_documento)}
                            className="h-8 max-w-28 border-0 bg-transparent shadow-none"
                          >
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent align="start">
                            {TIPOS_DOCUMENTOS.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </InputGroupAddon>
                </InputGroup>

                <FieldError errors={[errors.tipo_documento]} />
              </>
            )}
          </FormField>

          <PasswordField
            name="password"
            label="Contraseña"
            labelAside={
              <Link
                to={ROUTE_PATHS.auth.recuperarPassword}
                className="text-xs text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            }
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            disabled={isSubmitting}
          />

          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Ingresando…"
            icon={ArrowRight}
            className="h-10 w-full"
          >
            Ingresar
          </LoadingButton>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
