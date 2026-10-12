import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "@/app/layouts/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import AreasPage from "@/pages/areas/AreasPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import EnConstruccionPage from "@/pages/construccion/EnConstruccionPage";

import { ROUTE_PATHS } from "@/app/routes/path";
import { pendingPages } from "./pending-pages";

/**
 * Relaciona las URLs con sus páginas.
 * Las páginas internas comparten el layout principal.
 */
export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.root,
    element: <Navigate to={ROUTE_PATHS.dashboard} replace />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTE_PATHS.dashboard,
        element: <DashboardPage />,
      },
      {
        path: ROUTE_PATHS.organizacion.areas,
        element: <AreasPage />,
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