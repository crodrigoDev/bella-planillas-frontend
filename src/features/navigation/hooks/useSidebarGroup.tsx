import { useState } from "react";
import type { SidebarItem } from "../types/navigation.types";

export function useSidebarGroup(
  items: readonly SidebarItem[],
  pathname: string,
) {
  const activeGroupTitle =
    items.find(
      (item) =>
        item.type === "group" &&
        item.items.some(
          (subItem) =>
            pathname === subItem.to || pathname.startsWith(`${subItem.to}/`),
        ),
    )?.label ?? null;

  const [openGroup, setOpenGroup] = useState<string | null>(activeGroupTitle);
  const [previousPathname, setpreviousPathname] = useState(pathname);

  // Al cambiar de ruta, abre su grupo; si no pertenece a uno, cierra todos
  if (previousPathname !== pathname) {
    setpreviousPathname(pathname);
    setOpenGroup(activeGroupTitle);
  }

  return { openGroup, setOpenGroup };
}
