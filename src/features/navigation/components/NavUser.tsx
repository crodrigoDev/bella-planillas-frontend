import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavigationUser } from "@/features/navigation/types/navigation.types";
import { Spinner } from "@/components/ui/spinner";

interface NavUserProps {
  user: NavigationUser;
  onLogout: () => void;
  isLoggingOut: boolean;
}

/**
 * Muestra al usuario actual y sus opciones personales en el sidebar
 */
const NavUser = ({ user, onLogout, isLoggingOut }: NavUserProps) => {
  const { isMobile } = useSidebar();

  // Usa las primeras letras del nombre cuando no hay una foto disponible
  const iniciales = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" />}
            aria-busy={isLoggingOut}
          >
            <Avatar>
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
              <AvatarFallback>{iniciales}</AvatarFallback>
            </Avatar>

            <span className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>

            <ChevronsUpDown className="ms-auto" aria-hidden="true" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            className="min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                render={<NavLink to={ROUTE_PATHS.perfil} />}
                disabled={isLoggingOut}
              >
                <UserRound aria-hidden="true" />
                <span>Mi perfil</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                disabled={isLoggingOut}
                closeOnClick={false}
                onClick={onLogout}
              >
                {isLoggingOut ? (
                  <Spinner aria-label="Cerrando sesión" />
                ) : (
                  <LogOut aria-hidden="true" />
                )}
                <span>
                  {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
