import { Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { ROUTE_PATHS } from "@/app/routes/path";
import AppHeader from "@/features/navigation/components/AppHeader";
import AppSidebar from "@/features/navigation/components/AppSidebar";
import { RRHH_SIDEBAR_ITEMS } from "@/features/navigation/config/navigation.config";
import type { NavigationUser } from "@/features/navigation/types/navigation.types";
import type { CSSProperties } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { filterSidebarItems } from "@/features/navigation/utils/filter-sidebar-items";
import { canAccessRoute } from "@/features/auth/config/route-access.config";
import { PERFIL_MOCK } from "@/features/perfil/data/perfil.mock";

/**
 * Comparte el sidebar y la estructura principal entre las páginas internas
 */
export default function AppLayout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  // Guarda el estado del cierre de sesión para mostrar la espera o el error
  const logoutMutation = useMutation({
    mutationFn: logout,
    retry: false,
    onSuccess: () => { void navigate(ROUTE_PATHS.auth.login, { replace: true }); },
  });

  // Muestra las opciones de RRHH mientras revisamos el diseño sin sesión
  const role = APP_PREVIEW_MODE ? "RRHH" : session?.usuario.rol;
  if (!role) return null;

  const sidebarItems = filterSidebarItems(RRHH_SIDEBAR_ITEMS, role);

  // Muestra el perfil de ejemplo en la demostracion y la cuenta real al iniciar sesion
  const user: NavigationUser | null =
    APP_PREVIEW_MODE
      ? { name: PERFIL_MOCK.empleado?.nombre_completo ?? "Recursos Humanos", email: PERFIL_MOCK.email }
      : session
        ? { name: session.usuario.nombre, email: session.usuario.email }
        : null;

  /**
   * Solicita el cierre de sesión desde el menú del usuario
   */
  const handleLogout = (): void => {
    if (logoutMutation.isPending) return;

    // Sin una sesion real, salir de la demostracion solo lleva al login
    if (!session) {
      void navigate(ROUTE_PATHS.auth.login, { replace: true });
      return;
    }

    // La mutación guarda los errores para mostrarlos en la página
    logoutMutation.mutate();
  };

  return (
    <SidebarProvider
      style={{ "--sidebar-width-icon": "4rem" } as CSSProperties}
    >
      <AppSidebar
        items={sidebarItems}
        user={user}
        onLogout={handleLogout}
        isLoggingOut={logoutMutation.isPending}
      />

      <SidebarInset className="min-w-0">
        <AppHeader
          canSearchEmpleados={canAccessRoute(
            ROUTE_PATHS.gestionPersonal.empleados,
            role,
          )}
        />

        <div className="flex-1 space-y-4 p-4">
          {logoutMutation.isError && (
            <Alert variant="destructive">
              <AlertTitle>No se pudo cerrar sesión</AlertTitle>
              <AlertDescription>
                {getApiErrorMessage(logoutMutation.error)}
              </AlertDescription>
            </Alert>
          )}

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
