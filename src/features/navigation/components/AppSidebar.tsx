import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import type {
  NavigationUser,
  SidebarItem,
} from "@/features/navigation/types/navigation.types";
import NavMain from "@/features/navigation/components/NavMain";
import NavUser from "@/features/navigation/components/NavUser";
import SidebarBrand from "@/features/navigation/components/SidebarBrand";
import { CustomTrigger } from "./CustomTrigger";

interface AppSidebarProps {
  items: readonly SidebarItem[];
  user: NavigationUser;
}

/**
 * Organiza la identidad, la navegación y el usuario dentro del sidebar.
 *
 * Recibe las opciones y el usuario desde fuera para que el layout pueda
 * proporcionar los datos correspondientes a la sesión actual
 */
export default function AppSidebar({ items, user }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>

      <SidebarFooter className="flex items-center">
        <CustomTrigger />
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-primary" />
    </Sidebar>
  );
}
