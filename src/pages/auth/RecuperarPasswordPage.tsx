import { useMutation } from "@tanstack/react-query";
import type { SolicitudRecuperacionDTO } from "@jyp/shared-contracts";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RecuperarPasswordForm from "@/features/auth/components/RecuperarPasswordForm";
import { authService } from "@/features/auth/services/auth.service";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";

/** Solicita la recuperación y muestra la confirmación o el error del servidor */
const RecuperarPasswordPage = () => {
  // Evita repetir automaticamente una solicitud que puede generar un correo
  const recoveryMutation = useMutation({
    mutationFn: authService.requestPasswordRecovery,
    retry: false,
  });

  /** Espera el envio mientras la mutación guarda el resultado para mostrarlo */
  const handleRecovery = async (
    values: SolicitudRecuperacionDTO,
  ): Promise<void> => {
    try {
      await recoveryMutation.mutateAsync(values);
    } catch {
      // El mensaje se muestra debajo usando el error de la mutación
    }
  };

  return (
    <Card className="w-full max-w-md gap-6 py-8 shadow-sm ring-0">
      <CardHeader className="gap-2 px-8">
        <CardTitle>
          <h1 className="text-2xl font-semibold tracking-tight">
            Recuperar contraseña
          </h1>
        </CardTitle>
        <CardDescription>
          Ingresa tu número de documento para solicitar las instrucciones de
          recuperación al correo vinculado a tu cuenta.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-8">
        {recoveryMutation.isSuccess ? (
          <Alert role="status">
            <MailCheck aria-hidden="true" />
            <AlertTitle>Solicitud procesada</AlertTitle>
            <AlertDescription>
              {/* Conserva el mensaje que no revela si existe una cuenta */}
              <p>{recoveryMutation.data.message}</p>
              <p>Revisa también tu carpeta de correo no deseado.</p>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {recoveryMutation.isError && (
              <Alert variant="destructive">
                <AlertTitle>No se pudo procesar la solicitud</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(recoveryMutation.error)}
                </AlertDescription>
              </Alert>
            )}

            <RecuperarPasswordForm onSubmit={handleRecovery} />
          </>
        )}

        <Link
          to={ROUTE_PATHS.auth.login}
          className="flex items-center justify-center gap-2 rounded-sm text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio de sesión
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecuperarPasswordPage;
