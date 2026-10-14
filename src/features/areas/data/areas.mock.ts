import type { AreaViewModel } from "@/features/areas/types/areas.types";
import {
  AREAS_MOCK,
  CARGOS_MOCK,
  EMPLEADOS_MOCK,
} from "@/features/empleados/data/empleados.mock";

// Usa los mismos nombres e IDs que el resto de vistas de la demostracion
export const areasMock: AreaViewModel[] = AREAS_MOCK.map((area) => ({
  ...area,
  descripcion: `Organización y funciones de ${area.nombre.toLowerCase()}`,
  activeEmployees: EMPLEADOS_MOCK.filter(
    (emp) => emp.activo && !emp.deleted_at && emp.area_id === area.id,
  ).length,
  activePositions: CARGOS_MOCK.filter((cargo) => cargo.id_area === area.id)
    .length,
  associatedSchedules: 3,
  isActive: true,
}));
