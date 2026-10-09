import { ROUTE_PATHS } from "@/app/routes/path";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { FieldError } from "@/components/ui/field";
import type { LoginDTO } from "@jyp/shared-contracts";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

/**
 * Presenta la Card de acceso a la aplicación
 *
 * @remarks
 * Muestra los errores de la petición y navega al dashboard
 * después de una autenticación exitosa
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: login,
    retry: false,
    onSuccess: () => {
      void navigate(ROUTE_PATHS.dashboard, { replace: true });
    },
  });

  /**
   * Ejecuta el login y espera su finalización
   *
   * @param values - Credenciales validadas por el formulario
   */
  const handleLogin = async (values: LoginDTO): Promise<void> => {
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
      </CardContent>
    </Card>
  );
}
