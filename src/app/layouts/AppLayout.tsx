import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/features/navigation/components/AppSidebar";
import { RRHH_SIDEBAR_ITEMS } from "@/features/navigation/config/navigation.config";
import type { NavigationUser } from "@/features/navigation/types/navigation.types";
import type { CSSProperties } from "react";

/**
 * Usuario temporal para comprobar la navegacion
 */
const MOCK_USUARIO: NavigationUser = {
  name: "Rodrigo Castillo",
  email: "rodrick@gmail.com",
};

/**
 * Comparte el sidebar y la estructura principal entre las páginas internas.
 */
export default function AppLayout() {
  return (
    <SidebarProvider
      style={{ "--sidebar-width-icon": "4rem" } as CSSProperties}
    >
      <AppSidebar items={RRHH_SIDEBAR_ITEMS} user={MOCK_USUARIO} />

      <SidebarInset>
        <header className="flex h-14 items-center border-b border-sidebar-border px-4">
          <SidebarTrigger />
        </header>

        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
