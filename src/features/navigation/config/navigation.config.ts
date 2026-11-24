import {
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ClipboardList,
  FileDown,
  FilePlus2,
  FileText,
  LayoutDashboard,
  Network,
  Receipt,
  ScanLine,
  Shield,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import { ROUTE_PATHS } from "@/app/routes/path";
import type { SidebarItem } from "../types/navigation.types";

/**
 * Define las opciones de navegación de la aplicación; cada rol ve solo las que puede abrir
 */
export const SIDEBAR_ITEMS = [
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
        label: "Contratos",
        to: ROUTE_PATHS.gestionPersonal.contratos,
        icon: FileText,
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
      {
        label: "Cierre mensual",
        to: ROUTE_PATHS.asistencia.cierreMensual,
        icon: CalendarCheck,
      },
      {
        label: "Calendario",
        to: ROUTE_PATHS.asistencia.calendario,
        icon: CalendarRange,
      },
    ],
  },
  {
    type: "group",
    label: "Nómina",
    icon: Wallet,
    items: [
      {
        label: "Planillas",
        to: ROUTE_PATHS.nomina.planillas,
        icon: Receipt,
      },
      {
        label: "Novedades",
        to: ROUTE_PATHS.nomina.novedades,
        icon: FilePlus2,
      },
      {
        label: "Exportaciones",
        to: ROUTE_PATHS.nomina.exportaciones,
        icon: FileDown,
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
