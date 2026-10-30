import { Navigate, Outlet } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { canAccessRoute } from "@/features/auth/config/route-access.config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ForbiddenPage from "@/pages/forbidden/ForbiddenPage";

interface RoleRouteProps {
  path: string;
}

/** Comprueba el rol despues de que ProtectedRoute haya validado la sesión */
export default function RoleRoute({ path }: RoleRouteProps) {
  const { session } = useAuth();

  if (!session) return <Navigate to={ROUTE_PATHS.auth.login} replace />;

  if (!canAccessRoute(path, session.usuario.rol)) return <ForbiddenPage />;

  return <Outlet />;
}
