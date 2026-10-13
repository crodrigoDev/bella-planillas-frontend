import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginDTO, LoginSchema } from "@jyp/shared-contracts";
import { ArrowRight } from "lucide-react";
import { ROUTE_PATHS } from "@/app/routes/path";
import { TIPOS_DOCUMENTOS } from "@/features/auth/data/tipo-documentos.data";
import PasswordInput from "@/features/auth/components/PasswordInput";

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
export default function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    handleSubmit,
    register,
    control,
    trigger,
    formState: { errors, isSubmitting, touchedFields, isSubmitted },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      tipo_documento: "DNI",
      nro_documento: "",
      password: "",
    },
    mode: "onTouched",
  });

  // handleSubmit valida primero, esperar el callback mantiene el estado de
  // isSubmitting activo mientras termina la operación del componente padre
  const submit = handleSubmit(async (values) => {
    await onSubmit?.(values);
  });

  return (
    <form noValidate onSubmit={submit}>
      <FieldGroup>
        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel
              htmlFor="login-documento"
              className="text-xs text-foreground"
            >
              Número de documento
            </FieldLabel>

            <span className="text-xs text-muted-foreground">Requerido</span>
          </div>

          <InputGroup className="h-10">
            <InputGroupInput
              {...register("nro_documento")}
              id="login-documento"
              type="text"
              placeholder="Ej. 12345678"
              autoComplete="username"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.nro_documento)}
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

          <FieldError
            id="login-tipo-documento-error"
            errors={[errors.tipo_documento]}
          />

          <FieldError
            id="login-documento-error"
            errors={[errors.nro_documento]}
          />
        </Field>

        <Field>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <FieldLabel
              htmlFor="login-password"
              className="text-xs text-foreground"
            >
              Contraseña
            </FieldLabel>

            <Link
              to={ROUTE_PATHS.auth.recuperarPassword}
              className="text-xs text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <PasswordInput
            {...register("password")}
            id="login-password"
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.password)}
          />

          <FieldError id="login-password-error" errors={[errors.password]} />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
          {isSubmitting ? (
            <>
              <Spinner />
              Ingresando…
            </>
          ) : (
            <>
              Ingresar
              <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
