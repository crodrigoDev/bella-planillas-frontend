import type { LucideIcon } from "lucide-react";

/**
 * Representa el enlace que dirige al usuario a una página del sistema
 */
export interface SidebarLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

/**
 * Representa un conjunto de enlaces relacionados dentro del sidebar
 */
export interface SidebarGroup {
  type: "group";
  label: string;
  icon: LucideIcon;
  items: readonly SidebarLink[];
}

/**
 * Define los elementos que puede mostrar el sidebar.
 *
 * Un elemento puede ser un enlace directo o un grupo desplegable
 * que contiene varias opciones relacionadas
 */
export type SidebarItem = ({ type: "link" } & SidebarLink) | SidebarGroup;

/**
 * Datos que el sidebar necesita mostrar del usuario actual
 */
export interface NavigationUser {
  name: string;
  email: string;
  avatarUrl?: string;
}
