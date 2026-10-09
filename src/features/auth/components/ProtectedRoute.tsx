import { Navigate, Outlet } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Permite acceder a las rutas hijas cuando existe una sesión
 *
 * @remarks
 * Redirige a login cuando el usuario no esta autenticado
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to={ROUTE_PATHS.auth.login} replace />;

  return <Outlet />;
}
