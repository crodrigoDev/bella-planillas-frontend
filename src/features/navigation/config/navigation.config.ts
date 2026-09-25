import {
  ArrowLeftRight,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  ChartBar,
  ClipboardList,
  Clock,
  LayoutDashboard,
  Network,
  ScanLine,
  TriangleAlert,
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
      {
        label: "Movimientos Laborales",
        to: ROUTE_PATHS.gestionPersonal.movimientosLaborales,
        icon: ArrowLeftRight,
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
    label: "Asistencia y turnos",
    icon: CalendarClock,
    items: [
      {
        label: "Resumen de asistencia",
        to: ROUTE_PATHS.asistenciaTurnos.resumenAsistencia,
        icon: ChartBar,
      },
      {
        label: "Marcaciones",
        to: ROUTE_PATHS.asistenciaTurnos.marcaciones,
        icon: ScanLine,
      },
      {
        label: "Incidencias",
        to: ROUTE_PATHS.asistenciaTurnos.incidencias,
        icon: TriangleAlert,
      },
      {
        label: "Turnos",
        to: ROUTE_PATHS.asistenciaTurnos.turnos,
        icon: Clock,
      },
      {
        label: "Asignación de turnos",
        to: ROUTE_PATHS.asistenciaTurnos.asignacionTurnos,
        icon: CalendarDays,
      },
    ],
  },
] as const satisfies readonly SidebarItem[];
