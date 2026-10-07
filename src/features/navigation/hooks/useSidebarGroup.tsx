import { useState } from "react";
import type { SidebarItem } from "../types/navigation.types";

/**
 * Administra que grupo del sidebar permanece abierto
 *
 * @remarks
 * Inicialmente abre el grupo que contiene la ruta actual
 * Permite cambiarlo manualmente y lo sincroniza al navegar a otra ruta
 * Si la nueva ruta no pertenece a ningún grupo, cierra todos los grupos
 *
 * @param items - Opciones de navegación disponibles
 * @param pathname - Ruta actual
 * @returns El grupo abierto y la función para actualizarlo
 */
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
