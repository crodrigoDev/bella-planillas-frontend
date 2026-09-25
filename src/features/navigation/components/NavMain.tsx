import { NavLink, useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { SidebarItem } from "@/features/navigation/types/navigation.types";
import NavGroup from "@/features/navigation/components/NavGroup";
import { cn } from "cn";
import { useSidebarGroup } from "../hooks/useSidebarGroup";

interface NavMainProps {
  items: readonly SidebarItem[];
}

const activeNavClass =
  "bg-primary/5! text-primary! hover:text-primary! focus:text-primary! [&_svg]:text-primary! [&_span]:text-primary!";

/**
 * Muestra las opciones principales del sidebar
 */
export default function NavMain({ items }: NavMainProps) {
  const { pathname } = useLocation();
  const { openGroup, setOpenGroup } = useSidebarGroup(items, pathname);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            if (item.type === "group")
              return (
                <NavGroup
                  key={item.label}
                  group={item}
                  open={openGroup === item.label}
                  onOpenChange={(isOpen) =>
                    setOpenGroup(isOpen ? item.label : null)
                  }
                />
              );

            const ItemIcon = item.icon;
            const isActive =
              pathname === item.to || pathname.startsWith(`${item.to}/`);

            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  render={<NavLink to={item.to} />}
                  className={cn(isActive && activeNavClass)}
                >
                  <ItemIcon aria-hidden="true" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
