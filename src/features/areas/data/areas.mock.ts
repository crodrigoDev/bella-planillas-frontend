import type { AreaViewModel } from "../types/areas.types";

export const areasMock: AreaViewModel[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    nombre: "Operaciones y Logística",
    descripcion: "Gestión de operaciones y almacén",
    activeEmployees: 5,
    activePositions: 1,
    associatedSchedules: 3,
    isActive: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    nombre: "Ventas y Comercial",
    descripcion: "Gestión comercial y atención de clientes",
    activeEmployees: 4,
    activePositions: 1,
    associatedSchedules: 3,
    isActive: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    nombre: "Tecnología y Desarrollo",
    descripcion: "Sistemas y desarrollo de software",
    activeEmployees: 5,
    activePositions: 1,
    associatedSchedules: 3,
    isActive: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    nombre: "Administración y Finanzas",
    descripcion: "Administración, contabilidad y finanzas",
    activeEmployees: 4,
    activePositions: 1,
    associatedSchedules: 3,
    isActive: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    nombre: "Recursos Humanos",
    descripcion: "Gestión administrativa del personal",
    activeEmployees: 3,
    activePositions: 1,
    associatedSchedules: 3,
    isActive: true,
  },
];
