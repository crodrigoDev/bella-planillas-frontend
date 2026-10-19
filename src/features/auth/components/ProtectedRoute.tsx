import { Link, Navigate, Outlet } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import SessionLoadingScreen from "@/features/auth/components/SessionLoadingScreen";

/**
 * Permite acceder a las rutas hijas cuando existe una sesión
 *
 * @remarks
 * Espera la comprobación de la sesión antes de permitir el acceso
 * Redirige a login cuando se confirma que no hay una sesión
 */
export default function ProtectedRoute() {
  const { isAuthenticated, initialization, retryInitialization } = useAuth();

  if (
    initialization.status === "loading" ||
    initialization.status === "entering"
  ) {
    return <SessionLoadingScreen />;
  }

  // Un error de conexión bloquea solo el acceso a las páginas protegidas
  if (initialization.status === "error") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p role="alert">{initialization.message}</p>

        <Button type="button" onClick={retryInitialization}>
          Reintentar
        </Button>

        <Link
          to={ROUTE_PATHS.auth.login}
          className="rounded-sm text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Ir al inicio de sesión
        </Link>
      </main>
    );
  }

  if (!isAuthenticated) return <Navigate to={ROUTE_PATHS.auth.login} replace />;

  return <Outlet />;
}
