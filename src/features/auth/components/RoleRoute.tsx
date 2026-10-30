import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { canAccessRoute } from "@/features/auth/config/route-access.config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ForbiddenPage from "@/pages/forbidden/ForbiddenPage";

interface RoleRouteProps {
  path: string;
}

/**
 * Comprueba el rol despues de que ProtectedRoute haya validado la sesión
 *
 * @remarks
 * Reenvía el contexto del `Outlet` padre, para que una ruta hija con permiso
 * propio (las pestañas de la ficha) siga recibiéndolo.
 */
export default function RoleRoute({ path }: RoleRouteProps) {
  const { session } = useAuth();
  const context = useOutletContext();

  if (!session) return <Navigate to={ROUTE_PATHS.auth.login} replace />;

  if (!canAccessRoute(path, session.usuario.rol)) return <ForbiddenPage />;

  return <Outlet context={context} />;
}
