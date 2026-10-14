import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { ROUTE_PATHS } from "@/app/routes/path";
import GuestRoute from "@/features/auth/components/GuestRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import RoleRoute from "@/features/auth/components/RoleRoute";
import AuthLayout from "@/app/layouts/AuthLayout";
import AppLayout from "@/app/layouts/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import EmpleadosPage from "@/pages/empleados/EmpleadosPage";
import CrearEmpleadoPage from "@/pages/empleados/CrearEmpleadoPage";
import EditarEmpleadoPage from "@/pages/empleados/EditarEmpleadoPage";
import FichaEmpleadoPage from "@/pages/empleados/FichaEmpleadoPage";
import ImportarEmpleadosPage from "@/pages/empleados/ImportarEmpleadosPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import LoginPage from "@/pages/auth/LoginPage";
import RecuperarPasswordPage from "@/pages/auth/RecuperarPasswordPage";
import AreasPage from "@/pages/areas/AreasPage";
import CargosPage from "@/pages/cargos/CargosPage";
import JornadasPage from "@/pages/jornadas/JornadasPage";
import CrearJornadaPage from "@/pages/jornadas/CrearJornadaPage";
import SolicitudesPage from "@/pages/solicitudes/SolicitudesPage";
import MarcacionesPage from "@/pages/marcaciones/MarcacionesPage";
import AuditoriaPage from "@/pages/auditoria/AuditoriaPage";
import PerfilPage from "@/pages/perfil/PerfilPage";

// Estas vistas usan datos locales mientras presentamos la rama
const modulePages = [
  {
    path: ROUTE_PATHS.asistencia.crearJornada,
    title: "Nueva jornada",
    element: <CrearJornadaPage />,
  },
  {
    path: ROUTE_PATHS.gestionPersonal.solicitudes,
    title: "Solicitudes",
    element: <SolicitudesPage />,
  },
  {
    path: ROUTE_PATHS.organizacion.cargos,
    title: "Cargos",
    element: <CargosPage />,
  },
  {
    path: ROUTE_PATHS.asistencia.jornadas,
    title: "Jornadas",
    element: <JornadasPage />,
  },
  {
    path: ROUTE_PATHS.asistencia.marcaciones,
    title: "Marcaciones",
    element: <MarcacionesPage />,
  },
  {
    path: ROUTE_PATHS.auditoria,
    title: "Auditoría",
    element: <AuditoriaPage />,
  },
  { path: ROUTE_PATHS.perfil, title: "Mi perfil", element: <PerfilPage /> },
];

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
                handle: { title: "Dashboard" },
                element: <DashboardPage />,
              },
            ],
          },
          {
            element: APP_PREVIEW_MODE ? (
              <Outlet />
            ) : (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.empleados} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.empleados,
                handle: { title: "Empleados" },
                element: <EmpleadosPage />,
              },
            ],
          },
          {
            element: APP_PREVIEW_MODE ? (
              <Outlet />
            ) : (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.crearEmpleado} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.crearEmpleado,
                handle: { title: "Nuevo empleado" },
                element: <CrearEmpleadoPage />,
              },
            ],
          },
          {
            element: APP_PREVIEW_MODE ? (
              <Outlet />
            ) : (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.importarEmpleados} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.importarEmpleados,
                handle: { title: "Importar empleados" },
                element: <ImportarEmpleadosPage />,
              },
            ],
          },
          {
            element: APP_PREVIEW_MODE ? (
              <Outlet />
            ) : (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.editarEmpleado} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.editarEmpleado,
                handle: { title: "Editar empleado" },
                element: <EditarEmpleadoPage />,
              },
            ],
          },
          {
            element: APP_PREVIEW_MODE ? (
              <Outlet />
            ) : (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.fichaEmpleado} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.fichaEmpleado,
                handle: { title: "Ficha de empleado" },
                element: <FichaEmpleadoPage />,
              },
            ],
          },
          {
            element: APP_PREVIEW_MODE ? (
              <Outlet />
            ) : (
              <RoleRoute path={ROUTE_PATHS.organizacion.areas} />
            ),
            children: [
              {
                path: ROUTE_PATHS.organizacion.areas,
                handle: { title: "Áreas" },
                element: <AreasPage />,
              },
            ],
          },
          ...modulePages.map(({ path, title, element }) => ({
            element: APP_PREVIEW_MODE ? <Outlet /> : <RoleRoute path={path} />,
            children: [
              {
                path,
                handle: { title },
                element,
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
