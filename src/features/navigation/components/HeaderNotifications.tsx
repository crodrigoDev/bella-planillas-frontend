import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Presenta la campana y su panel mientras conectamos las alertas reales */
export default function HeaderNotifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notificaciones"
            title="Notificaciones"
            className="text-slate-600 dark:text-muted-foreground"
          />
        }
      >
        <Bell aria-hidden="true" className="size-4.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-72 max-w-[calc(100vw-2rem)] p-3"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm font-semibold text-foreground">
            Notificaciones
          </DropdownMenuLabel>
          <p className="px-1.5 py-4 text-sm text-muted-foreground">
            Aún no hay notificaciones para mostrar
          </p>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
