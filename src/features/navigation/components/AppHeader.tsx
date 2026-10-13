import { useLocation } from "react-router-dom";

import { pendingPages } from "@/app/routes/pending-pages";
import { SidebarTrigger } from "@/components/ui/sidebar";
import EmpleadosSearch from "@/features/empleados/components/EmpleadosSearch";
import HeaderNotifications from "./HeaderNotifications";

interface AppHeaderProps {
  canSearchEmpleados: boolean;
}

/** Comparte el titulo de la pagina, el buscador y la campana */
export default function AppHeader({ canSearchEmpleados }: AppHeaderProps) {
  const { pathname } = useLocation();
  const title = pendingPages.find(
    (page) => pathname === page.path || pathname.startsWith(`${page.path}/`),
  )?.title ?? "Dashboard";

  return (
    <header className="flex min-h-16 shrink-0 flex-wrap items-center gap-3 border-b border-sidebar-border bg-background px-4 py-3 md:flex-nowrap md:gap-5 md:px-6 md:py-0 lg:px-8">
      <SidebarTrigger className="md:hidden" aria-label="Abrir menú lateral" />
      <p className="min-w-0 flex-1 truncate text-lg font-semibold text-slate-950 dark:text-foreground">
        {title}
      </p>
      {canSearchEmpleados && <EmpleadosSearch />}
      <HeaderNotifications />
    </header>
  );
}
