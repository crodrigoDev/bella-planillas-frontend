import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "@/app/layouts/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

import { ROUTE_PATHS } from "@/app/routes/path";
import { pendingPages } from "./pending-pages";
import EnConstruccionPage from "@/pages/construccion/EnConstruccionPage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";

/**
 * Relaciona las URLs de la aplicación con sus páginas y layouts.
 *
 * Las rutas internas del sistema comparten `AppLayout`; las rutas especiales, como la
 * pagina no encontrada, se manejan fuera de ese layout
 */
export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.root,
    element: <Navigate to={ROUTE_PATHS.dashboard} replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTE_PATHS.auth.login,
        element: <LoginPage />,
      },
    ],
  },
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
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
