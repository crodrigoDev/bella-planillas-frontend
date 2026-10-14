import {
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Network,
  ScanLine,
  Shield,
  UserRound,
  Users,
} from "lucide-react";

import { ROUTE_PATHS } from "@/app/routes/path";
import type { SidebarItem } from "../types/navigation.types";

/**
 * Define las opciones de navegación disponibles para Recursos Humanos
 */
export const RRHH_SIDEBAR_ITEMS = [
  {
    type: "link",
    label: "Dashboard",
    to: ROUTE_PATHS.dashboard,
    icon: LayoutDashboard,
  },
  {
    type: "group",
    label: "Gestión de Personal",
    icon: Users,
    items: [
      {
        label: "Empleados",
        to: ROUTE_PATHS.gestionPersonal.empleados,
        icon: UserRound,
      },
      {
        label: "Solicitudes",
        to: ROUTE_PATHS.gestionPersonal.solicitudes,
        icon: ClipboardList,
      },
    ],
  },
  {
    type: "group",
    label: "Organización",
    icon: Building2,
    items: [
      {
        label: "Áreas",
        to: ROUTE_PATHS.organizacion.areas,
        icon: Network,
      },
      {
        label: "Cargos",
        to: ROUTE_PATHS.organizacion.cargos,
        icon: Briefcase,
      },
    ],
  },
  {
    type: "group",
    label: "Asistencia",
    icon: CalendarClock,
    items: [
      {
        label: "Jornadas",
        to: ROUTE_PATHS.asistencia.jornadas,
        icon: CalendarDays,
      },
      {
        label: "Marcaciones",
        to: ROUTE_PATHS.asistencia.marcaciones,
        icon: ScanLine,
      },
    ],
  },
  {
    type: "link",
    label: "Auditoría",
    icon: Shield,
    to: ROUTE_PATHS.auditoria,
  },
] as const satisfies readonly SidebarItem[];
