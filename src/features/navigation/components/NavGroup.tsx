import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import type { SidebarGroup } from "@/features/navigation/types/navigation.types";

interface NavGroupProps {
  group: SidebarGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GroupVariantsProps {
  group: SidebarGroup;
  pathname: string;
}

interface ExpandedNavGroupProps extends GroupVariantsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Comprueba si la ruta actual le pertenece a una opción de navegación
 */
function isPathActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

const activeNavClass =
  "bg-primary/5! text-primary! hover:text-primary! focus:text-primary! [&_svg]:text-primary! [&_span]:text-primary!";

/**
 * Muestra el grupo como una sección desplegable cuando el sidebar está abierto.
 */
function ExpandedNavGroup({
  group,
  pathname,
  open,
  onOpenChange,
}: ExpandedNavGroupProps) {
  const GroupIcon = group.icon;
  const isGroupActive = group.items.some((item) =>
    isPathActive(pathname, item.to),
  );

  return (
    <Collapsible
      render={<SidebarMenuItem />}
      open={open}
      onOpenChange={onOpenChange}
      className="group/collapsible"
    >
      <SidebarMenuButton
        isActive={isGroupActive}
        render={<CollapsibleTrigger />}
        className={cn(isGroupActive && activeNavClass)}
      >
        <GroupIcon aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{group.label}</span>

        <ChevronDown
          className="ms-auto transition-transform group-data-open/collapsible:rotate-180"
          aria-hidden="true"
        />
      </SidebarMenuButton>

      <CollapsibleContent>
        <SidebarMenuSub>
          {group.items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = isPathActive(pathname, item.to);

            return (
              <SidebarMenuSubItem key={item.to}>
                <SidebarMenuSubButton
                  isActive={isActive}
                  render={<NavLink to={item.to} />}
                  className={cn(isActive && activeNavClass)}
                >
                  <ItemIcon aria-hidden="true" />
                  <span className="text-xs">{item.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Muestra las opciones del grupo en un menú flotante cuando el sidebar
 * está reducido a iconos.
 */
function CollapsedNavGroup({ group, pathname }: GroupVariantsProps) {
  const GroupIcon = group.icon;
  const isGroupActive = group.items.some((item) =>
    isPathActive(pathname, item.to),
  );

  return (
    <DropdownMenu>
      <SidebarMenuItem>
        <DropdownMenuTrigger
          openOnHover
          delay={0}
          render={<SidebarMenuButton isActive={isGroupActive} />}
          className={cn(isGroupActive && activeNavClass)}
        >
          <GroupIcon aria-hidden="true" />
          <span>{group.label}</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={15}
          className="w-56"
        >
          <DropdownMenuGroup className="space-y-1">
            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
            {group.items.map((item) => {
              const ItemIcon = item.icon;
              const isActive = isPathActive(pathname, item.to);

              return (
                <DropdownMenuItem
                  key={item.to}
                  render={<NavLink to={item.to} />}
                  className={cn(
                    isActive && activeNavClass,
                    isActive && "[&_svg_*]:text-primary!",
                  )}
                >
                  <ItemIcon aria-hidden="true" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </SidebarMenuItem>
    </DropdownMenu>
  );
}

/**
 * Selecciona la presentación apropiada para un grupo de navegación
 */
export default function NavGroup({ group, open, onOpenChange }: NavGroupProps) {
  const { pathname } = useLocation();
  const { state, isMobile } = useSidebar();

  const shouldUseFloatingMenu = state === "collapsed" && !isMobile;

  if (shouldUseFloatingMenu)
    return <CollapsedNavGroup group={group} pathname={pathname} />;

  return (
    <ExpandedNavGroup
      group={group}
      pathname={pathname}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
