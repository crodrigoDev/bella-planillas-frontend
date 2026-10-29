import { createBrowserRouter, Navigate } from "react-router-dom";
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
import RestablecerPasswordPage from "@/pages/auth/RestablecerPasswordPage";
import EmpleadosPage from "@/pages/empleados/EmpleadosPage";
import EmpleadoDetallePage from "@/pages/empleados/EmpleadoDetallePage";
import NuevoEmpleadoPage from "@/pages/empleados/NuevoEmpleadoPage";

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
          {
            path: ROUTE_PATHS.auth.recuperarPassword,
            element: <RecuperarPasswordPage />,
          },
          {
            path: ROUTE_PATHS.auth.restablecerPassword,
            element: <RestablecerPasswordPage />,
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
            element: <RoleRoute path={ROUTE_PATHS.dashboard} />,
            children: [
              {
                path: ROUTE_PATHS.dashboard,
                element: <DashboardPage />,
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.gestionPersonal.empleados} />,
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.empleados,
                element: <EmpleadosPage />,
              },
            ],
          },
          {
            element: (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.nuevoEmpleado} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.nuevoEmpleado,
                element: <NuevoEmpleadoPage />,
              },
            ],
          },
          {
            element: (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.detalleEmpleado} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.detalleEmpleado,
                element: <EmpleadoDetallePage />,
              },
            ],
          },
          ...pendingPages.map(({ path, title }) => ({
            element: <RoleRoute path={path} />,
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
