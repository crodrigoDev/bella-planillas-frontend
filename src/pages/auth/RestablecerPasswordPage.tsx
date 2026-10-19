import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { RestablecerPasswordSchema } from "@jyp/shared-contracts";
import { ROUTE_PATHS } from "@/app/routes/path";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authService } from "@/features/auth/services/auth.service";
import RestablecerPasswordForm from "@/features/auth/components/RestablecerPasswordForm";
import type { RestablecerFormValues } from "@/features/auth/schemas/auth.schema";

const linkClassName =
  "flex items-center justify-center gap-2 rounded-sm text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

/**
 * Cambia la contraseña con el token que llega en la URL: ?token=[...]
 */
export default function RestablecerPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  // Descarta enlaces sin token o con formato roto antes de mostrar el formulario
  const isTokenValid =
    RestablecerPasswordSchema.shape.token_compuesto.safeParse(token).success;

  // Evita repetir automaticamente un token que se consume una sola vez
  const resetMutation = useMutation({
    mutationFn: authService.resetPassword,
    retry: false,
  });

  const handleReset = async (values: RestablecerFormValues): Promise<void> => {
    try {
      await resetMutation.mutateAsync({
        token_compuesto: token,
        nueva_password: values.nueva_password,
      });
    } catch {
      // El mensaje se muestra debajo usando el error de la mutacion
    }
  };

  return (
    <Card className="w-full max-w-md gap-6 py-8 shadow-sm ring-0">
      <CardHeader className="gap-2 px-8">
        <CardTitle>
          <h1 className="text-2xl font-semibold tracking-tight">
            Restablecer contraseña
          </h1>
        </CardTitle>
        <CardDescription>
          Elige una nueva contraseña para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-8">
        {!isTokenValid ? (
          <>
            <Alert variant="destructive">
              <AlertTitle>Enlace no válido</AlertTitle>
              <AlertDescription>
                El enlace está incompleto o es incorrecto. Solicita uno nuevo.
              </AlertDescription>
            </Alert>

            <Link
              to={ROUTE_PATHS.auth.recuperarPassword}
              className={linkClassName}
            >
              Solicitar un nuevo enlace
            </Link>
          </>
        ) : resetMutation.isSuccess ? (
          <Alert role="status">
            <CircleCheck aria-hidden="true" />
            <AlertTitle>Contraseña actualizada</AlertTitle>
            <AlertDescription>
              <p>{resetMutation.data.message}</p>
              <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {resetMutation.isError && (
              <Alert variant="destructive">
                <AlertTitle>No se pudo cambiar la contraseña</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(resetMutation.error)}
                </AlertDescription>
              </Alert>
            )}

            <RestablecerPasswordForm onSubmit={handleReset} />

            {resetMutation.isError && (
              <Link
                to={ROUTE_PATHS.auth.recuperarPassword}
                className={linkClassName}
              >
                Solicitar un nuevo enlace
              </Link>
            )}
          </>
        )}

        <Link to={ROUTE_PATHS.auth.login} className={linkClassName}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio de sesión
        </Link>
      </CardContent>
    </Card>
  );
}
