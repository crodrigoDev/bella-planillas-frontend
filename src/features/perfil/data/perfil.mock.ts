import type { MiPerfilResponseDto } from "@jyp/shared-contracts";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";

/** Describe el perfil de demostracion sin crear una sesion de autenticacion */
export function getPerfilMock(): MiPerfilResponseDto {
  const emp = EMPLEADOS_MOCK.find(
    (item) => item.activo && item.area.nombre === "Recursos Humanos",
  );
  return {
    id: "80000000-0000-4000-8000-000000000001",
    email: "rrhh@example.com",
    rol: "RRHH",
    ultimo_acceso: new Date("2026-10-14T13:00:00.000Z"),
    empleado: emp
      ? {
          id: emp.id,
          nro_documento: emp.nro_documento,
          nombre_completo: getEmpleadoNombre(emp),
          cargo: emp.cargo.nombre,
          area: emp.area.nombre,
        }
      : null,
  };
}
