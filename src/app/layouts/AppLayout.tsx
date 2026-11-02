import { ErrorAlert } from "@/components/feedback/ErrorAlert";
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
import { useAuth } from "@/features/auth/hooks/useAuth";
import { filterSidebarItems } from "@/features/navigation/utils/sidebar.utils";
import {
  renovarAccessToken,
  useAuthStore,
} from "@/features/auth/store/auth.store";
import { NotificacionesButton } from "@/features/notificaciones/components/NotificacionesButton";

// Lee el token al momento de conectar el tiempo real, no el del primer render
const getAccessToken = (): string | null =>
  useAuthStore.getState().session?.accessToken ?? null;

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
      className="h-svh"
      style={{ "--sidebar-width-icon": "4rem" } as CSSProperties}
    >
      <AppSidebar
        items={sidebarItems}
        user={user}
        onLogout={handleLogout}
        isLoggingOut={logoutMutation.isPending}
      />

      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-sidebar-border px-4 sm:px-6 lg:px-8">
          <SidebarTrigger />
          <NotificacionesButton
            userId={session.usuario.id}
            getToken={getAccessToken}
            renovarToken={renovarAccessToken}
          />
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <ErrorAlert
            error={logoutMutation.error}
            title="No se pudo cerrar sesión"
          />

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
