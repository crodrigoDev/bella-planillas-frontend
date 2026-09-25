import { ROUTE_PATHS } from "@/app/routes/path";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Building } from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * Presenta la identidad visual del sistema en la cabecera del sidebar.
 */
export default function SidebarBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip="Bella Planillas"
          render={<NavLink to={ROUTE_PATHS.dashboard} />}
        >
          <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building className="size-4" aria-hidden="true" />
          </span>

          <span className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold">Bella Planillas</span>
            <span className="truncate text-xs text-muted-foreground">
              por Bellasoft
            </span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
