import { Navigate, Outlet } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Permite acceder a las rutas hijas cuando no existe una sesion
 *
 * @remarks
 * Redirige al dashboard cuando el usuario ya esta autenticado
 */
export default function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to={ROUTE_PATHS.dashboard} replace />;

  return <Outlet />;
}
