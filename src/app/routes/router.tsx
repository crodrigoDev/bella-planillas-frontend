import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { pendingPages } from "@/app/routes/pendingPages.config";
import GuestRoute from "@/features/auth/components/GuestRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import RoleRoute from "@/features/auth/components/RoleRoute";
import SessionLoadingScreen from "@/features/auth/components/SessionLoadingScreen";
import AuthLayout from "@/app/layouts/AuthLayout";
import AppLayout from "@/app/layouts/AppLayout";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import EnConstruccionPage from "@/pages/construccion/EnConstruccionPage";
import LoginPage from "@/pages/auth/LoginPage";

/**
 * Carga una página solo cuando se entra a su ruta
 *
 * @remarks
 * Cada página queda en su propio archivo JS. Mientras llega, React Router
 * mantiene visible la página anterior.
 */
const lazyPage =
  (load: () => Promise<{ default: ComponentType }>) => async () => ({
    Component: (await load()).default,
  });

const DETALLE_EMPLEADO_TABS = [
  {
    path: ROUTE_PATHS.gestionPersonal.detalleEmpleadoContratos,
    lazy: lazyPage(
      () => import("@/pages/empleados/detalle/EmpleadoContratosPage"),
    ),
  },
  {
    path: ROUTE_PATHS.gestionPersonal.detalleEmpleadoDerechohabientes,
    lazy: lazyPage(
      () => import("@/pages/empleados/detalle/EmpleadoDerechohabientesPage"),
    ),
  },
  {
    path: ROUTE_PATHS.gestionPersonal.detalleEmpleadoAsistencia,
    lazy: lazyPage(
      () => import("@/pages/empleados/detalle/EmpleadoAsistenciaPage"),
    ),
  },
  {
    path: ROUTE_PATHS.gestionPersonal.detalleEmpleadoHistorial,
    lazy: lazyPage(
      () => import("@/pages/empleados/detalle/EmpleadoHistorialPage"),
    ),
  },
];

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
    // Si la primera página es diferida, mientras llega se ve la pantalla de carga
    HydrateFallback: SessionLoadingScreen,
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
            lazy: lazyPage(() => import("@/pages/auth/RecuperarPasswordPage")),
          },
          {
            path: ROUTE_PATHS.auth.restablecerPassword,
            lazy: lazyPage(
              () => import("@/pages/auth/RestablecerPasswordPage"),
            ),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    HydrateFallback: SessionLoadingScreen,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: <RoleRoute path={ROUTE_PATHS.dashboard} />,
            children: [
              {
                path: ROUTE_PATHS.dashboard,
                lazy: lazyPage(() => import("@/pages/dashboard/DashboardPage")),
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.gestionPersonal.empleados} />,
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.empleados,
                lazy: lazyPage(() => import("@/pages/empleados/EmpleadosPage")),
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
                lazy: lazyPage(
                  () => import("@/pages/empleados/NuevoEmpleadoPage"),
                ),
              },
            ],
          },
          {
            element: (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.importarEmpleados} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.importarEmpleados,
                lazy: lazyPage(
                  () => import("@/pages/empleados/ImportarEmpleadosPage"),
                ),
              },
            ],
          },
          {
            element: (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.editarEmpleado} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.editarEmpleado,
                lazy: lazyPage(
                  () => import("@/pages/empleados/EditarEmpleadoPage"),
                ),
              },
            ],
          },
          {
            element: (
              <RoleRoute
                path={ROUTE_PATHS.gestionPersonal.editarDatosFinancieros}
              />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.editarDatosFinancieros,
                lazy: lazyPage(
                  () => import("@/pages/empleados/EditarDatosFinancierosPage"),
                ),
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
                lazy: lazyPage(
                  () => import("@/pages/empleados/EmpleadoDetalleLayout"),
                ),
                // Cada pestaña de la ficha es una ruta hija con su propio permiso
                children: [
                  {
                    index: true,
                    lazy: lazyPage(
                      () =>
                        import("@/pages/empleados/detalle/EmpleadoInformacionPage"),
                    ),
                  },
                  ...DETALLE_EMPLEADO_TABS.map(({ path, lazy }) => ({
                    element: <RoleRoute path={path} />,
                    children: [{ path, lazy }],
                  })),
                ],
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.organizacion.areas} />,
            children: [
              {
                path: ROUTE_PATHS.organizacion.areas,
                lazy: lazyPage(() => import("@/pages/areas/AreasPage")),
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.asistencia.marcaciones} />,
            children: [
              {
                path: ROUTE_PATHS.asistencia.marcaciones,
                lazy: lazyPage(
                  () => import("@/pages/asistencia/MarcacionesPage"),
                ),
              },
            ],
          },
          {
            element: (
              <RoleRoute path={ROUTE_PATHS.asistencia.importarMarcaciones} />
            ),
            children: [
              {
                path: ROUTE_PATHS.asistencia.importarMarcaciones,
                lazy: lazyPage(
                  () => import("@/pages/asistencia/ImportarMarcacionesPage"),
                ),
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.asistencia.cierreMensual} />,
            children: [
              {
                path: ROUTE_PATHS.asistencia.cierreMensual,
                lazy: lazyPage(
                  () => import("@/pages/asistencia/CierreMensualPage"),
                ),
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.asistencia.jornadas} />,
            children: [
              {
                path: ROUTE_PATHS.asistencia.jornadas,
                lazy: lazyPage(() => import("@/pages/jornadas/JornadasPage")),
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.asistencia.nuevaJornada} />,
            children: [
              {
                path: ROUTE_PATHS.asistencia.nuevaJornada,
                lazy: lazyPage(
                  () => import("@/pages/jornadas/NuevaJornadaPage"),
                ),
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.asistencia.editarJornada} />,
            children: [
              {
                path: ROUTE_PATHS.asistencia.editarJornada,
                lazy: lazyPage(
                  () => import("@/pages/jornadas/EditarJornadaPage"),
                ),
              },
            ],
          },
          {
            element: (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.solicitudes} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.solicitudes,
                lazy: lazyPage(
                  () => import("@/pages/solicitudes/SolicitudesPage"),
                ),
              },
            ],
          },
          {
            element: (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.nuevaSolicitud} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.nuevaSolicitud,
                lazy: lazyPage(
                  () => import("@/pages/solicitudes/NuevaSolicitudPage"),
                ),
              },
            ],
          },
          {
            element: (
              <RoleRoute path={ROUTE_PATHS.gestionPersonal.detalleSolicitud} />
            ),
            children: [
              {
                path: ROUTE_PATHS.gestionPersonal.detalleSolicitud,
                lazy: lazyPage(
                  () => import("@/pages/solicitudes/SolicitudDetallePage"),
                ),
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.auditoria} />,
            children: [
              {
                path: ROUTE_PATHS.auditoria,
                lazy: lazyPage(() => import("@/pages/auditoria/AuditoriaPage")),
              },
            ],
          },
          {
            element: <RoleRoute path={ROUTE_PATHS.perfil} />,
            children: [
              {
                path: ROUTE_PATHS.perfil,
                lazy: lazyPage(() => import("@/pages/perfil/PerfilPage")),
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
