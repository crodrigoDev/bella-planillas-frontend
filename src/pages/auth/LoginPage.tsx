import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LoginDTO } from "@jyp/shared-contracts";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { ROUTE_PATHS } from "@/app/routes/path";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LoginForm from "@/features/auth/components/LoginForm";

/**
 * Presenta la Card de acceso a la aplicación
 *
 * @remarks
 * Muestra los errores de la petición.
 * `GuestRoute` gestiona la redirección cuando existe una sesión.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    retry: false,
  });

  /**
   * Ejecuta el login y espera su finalización
   *
   * @param values - Credenciales validadas por el formulario
   */
  const handleLogin = async (values: LoginDTO): Promise<void> => {
    // En la demostracion, el formulario valida los datos y permite entrar sin backend
    if (APP_PREVIEW_MODE) {
      void navigate(ROUTE_PATHS.dashboard, { replace: true });
      return;
    }

    try {
      await loginMutation.mutateAsync(values);
    } catch {
      // La mutación captura el error en loginMutation.error
      // y la página lo muestra mediante FieldError
    }
  };

  return (
    <Card className="w-full max-w-md gap-6 py-8 shadow-sm ring-0">
      <CardHeader className="gap-2 px-8">
        <CardTitle>
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenido</h1>
        </CardTitle>

        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8">
        {loginMutation.isError && (
          <FieldError className="mb-4">
            {getApiErrorMessage(loginMutation.error)}
          </FieldError>
        )}
        <LoginForm onSubmit={handleLogin} />
        {APP_PREVIEW_MODE && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Acceso de prueba: usa un DNI de 8 dígitos y una contraseña de al menos 8 caracteres
          </p>
        )}
      </CardContent>
    </Card>
  );
}
