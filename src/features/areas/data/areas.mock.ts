import type { AreaViewModel } from "@/features/areas/types/areas.types";

export const areasMock: AreaViewModel[] = [
  {
    id: "area-1",
    nombre: "Oficina (Administración & Oficina Central)",
    descripcion: "Gestión administrativa, contable y directiva.",
    activeEmployees: 42,
    activePositions: 8,
    associatedSchedules: 1,
    isActive: true,
  },
  {
    id: "area-2",
    nombre: "Seguridad (Seguridad & Vigilancia)",
    descripcion:
      "Vigilancia perimétrica, control de accesos e inspección.",
    activeEmployees: 24,
    activePositions: 3,
    associatedSchedules: 1,
    isActive: true,
  },
  {
    id: "area-3",
    nombre: "Limpieza (Limpieza & Mantenimiento)",
    descripcion:
      "Higiene integral de sedes, desinfección y mantenimiento básico.",
    activeEmployees: 18,
    activePositions: 2,
    associatedSchedules: 1,
    isActive: true,
  },
  {
    id: "area-4",
    nombre: "Atención al Cliente",
    descripcion:
      "Soporte y atención a usuarios y clientes institucionales.",
    activeEmployees: 0,
    activePositions: 0,
    associatedSchedules: 0,
    isActive: true,
  },
];