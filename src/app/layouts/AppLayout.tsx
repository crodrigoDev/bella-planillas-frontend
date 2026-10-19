import { Outlet } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/features/navigation/components/AppSidebar";
import { RRHH_SIDEBAR_ITEMS } from "@/features/navigation/config/navigation.config";
import type { NavigationUser } from "@/features/navigation/types/navigation.types";
import type { CSSProperties } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { filterSidebarItems } from "@/features/navigation/utils/filter-sidebar-items";

/**
 * Comparte el sidebar y la estructura principal entre las páginas internas
 */
export default function AppLayout() {
  const { session, logout } = useAuth();

  // Guarda el estado del cierre de sesión para mostrar la espera o el error
  const logoutMutation = useMutation({
    mutationFn: logout,
    retry: false,
  });

  if (!session) return null;

  // Usa los mismos permisos que las rutas para mostrar las opciones del usuario
  const sidebarItems = filterSidebarItems(
    RRHH_SIDEBAR_ITEMS,
    session.usuario.rol,
  );

  // Adapta los datos reales al formato que necesita el sidebar
  const user: NavigationUser = {
    name: session.usuario.nombre,
    rol: session.usuario.rol,
  };

  /**
   * Solicita el cierre de sesión desde el menú del usuario
   */
  const handleLogout = (): void => {
    if (logoutMutation.isPending) return;

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

      <SidebarInset>
        <header className="flex h-14 items-center border-b border-sidebar-border px-4">
          <SidebarTrigger />
        </header>

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
