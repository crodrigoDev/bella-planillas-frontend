import { Navigate, Outlet } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { useAuth } from "@/features/auth/hooks/useAuth";
import SessionLoadingScreen from "@/features/auth/components/SessionLoadingScreen";

/**
 * Permite acceder a las rutas hijas cuando no existe una sesion
 *
 * @remarks
 * Redirige al dashboard cuando el usuario ya esta autenticado
 */
export default function GuestRoute() {
  const { isAuthenticated, initialization } = useAuth();

  if (
    initialization.status === "loading" ||
    initialization.status === "entering"
  )
    return <SessionLoadingScreen />;

  if (isAuthenticated) return <Navigate to={ROUTE_PATHS.dashboard} replace />;

  return <Outlet />;
}
