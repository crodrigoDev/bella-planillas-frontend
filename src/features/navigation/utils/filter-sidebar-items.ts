import { canAccessRoute } from "@/features/auth/config/route-access.config";
import type { AuthRol } from "@/features/auth/types/auth.types";
import type { SidebarItem } from "@/features/navigation/types/navigation.types";

/** Conserva los enlaces permitidos y quita los grupos que quedan vacios */
export function filterSidebarItems(
  items: readonly SidebarItem[],
  role: AuthRol,
): SidebarItem[] {
  return items.flatMap((item): SidebarItem[] => {
    if (item.type === "link") {
      return canAccessRoute(item.to, role) ? [item] : [];
    }

    const visibleItems = item.items.filter((link) => canAccessRoute(link.to, role));

    return visibleItems.length > 0 ? [{ ...item, items: visibleItems }] : [];
  });
}
