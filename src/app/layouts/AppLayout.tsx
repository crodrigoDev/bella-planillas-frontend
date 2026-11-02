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
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";

const MOCK_USUARIO: NavigationUser = {
  name: "Rodrigo Castillo",
  email: "rodrick@gmail.com",
};

export default function AppLayout() {
  return (
    <SidebarProvider style={{ "--sidebar-width-icon": "4rem" } as CSSProperties}>
      <AppSidebar items={RRHH_SIDEBAR_ITEMS} user={MOCK_USUARIO} />
      
      <SidebarInset>
        {/* BARRA SUPERIOR: pl-[72px] empuja el texto "Dashboard" 72px a la derecha */}
        <header className="relative flex h-14 items-center justify-between border-b border-sidebar-border pr-6 pl-[72px]">
          
          {/* El icono se posiciona absoluto a 24px (left-6) para NO empujar el texto */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <SidebarTrigger />
          </div>

          <span className="font-semibold text-lg text-slate-800">Dashboard</span>

          <DashboardHeader />
          
        </header>

        {/* CONTENIDO: p-6 da márgenes, pl-[72px] fuerza a que el título empiece exactamente a 72px */}
        <div className="flex-1 p-6 pl-[72px] bg-slate-50/30">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}