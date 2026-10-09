import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { pendingPages } from "@/app/routes/pending-pages";
import GuestRoute from "@/features/auth/components/GuestRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AuthLayout from "@/app/layouts/AuthLayout";
import AppLayout from "@/app/layouts/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import EnConstruccionPage from "@/pages/construccion/EnConstruccionPage";
import LoginPage from "@/pages/auth/LoginPage";

/**
 * Relaciona las URLs de la aplicación con sus páginas y layouts.
 *
 * @remarks
 * Las páginas internas de `AppLayout` requieren de una sesión.
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
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTE_PATHS.dashboard,
            element: <DashboardPage />,
          },
          ...pendingPages.map(({ path, title }) => ({
            path,
            element: <EnConstruccionPage title={title} />,
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
