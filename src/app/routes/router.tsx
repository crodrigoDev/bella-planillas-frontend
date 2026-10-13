import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { ROUTE_PATHS } from "@/app/routes/path";
import { pendingPages } from "@/app/routes/pending-pages";
import GuestRoute from "@/features/auth/components/GuestRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import RoleRoute from "@/features/auth/components/RoleRoute";
import AuthLayout from "@/app/layouts/AuthLayout";
import AppLayout from "@/app/layouts/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import EnConstruccionPage from "@/pages/construccion/EnConstruccionPage";
import LoginPage from "@/pages/auth/LoginPage";
import RecuperarPasswordPage from "@/pages/auth/RecuperarPasswordPage";

/**
 * Relaciona las URLs de la aplicación con sus páginas y layouts.
 *
 * @remarks
 * Las páginas internas son publicas temporalmente mientras APP_PREVIEW_MODE esté activo
 * Las páginas de `AuthLayout` no requieren de una sesión
 */
export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.root,
    element: <Navigate to={ROUTE_PATHS.dashboard} replace />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTE_PATHS.auth.login,
            element: <LoginPage />,
          },
          {
            path: ROUTE_PATHS.auth.recuperarPassword,
            element: <RecuperarPasswordPage />,
          },
        ],
      },
    ],
  },
  {
    element: APP_PREVIEW_MODE ? <Outlet /> : <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: APP_PREVIEW_MODE ? (
              <Outlet />
            ) : (
              <RoleRoute path={ROUTE_PATHS.dashboard} />
            ),
            children: [
              {
                path: ROUTE_PATHS.dashboard,
                element: <DashboardPage />,
              },
            ],
          },
          ...pendingPages.map(({ path, title }) => ({
            element: APP_PREVIEW_MODE ? <Outlet /> : <RoleRoute path={path} />,
            children: [
              {
                path,
                element: <EnConstruccionPage title={title} />,
              },
            ],
          })),
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
