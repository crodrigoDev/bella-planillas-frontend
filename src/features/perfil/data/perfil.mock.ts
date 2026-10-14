import type { MiPerfilResponseDto } from "@jyp/shared-contracts";

// Perfil de demostracion, no crea una sesion de autenticacion
export const PERFIL_MOCK: MiPerfilResponseDto = {
  id: "80000000-0000-4000-8000-000000000001",
  email: "rrhh@example.com",
  rol: "RRHH",
  ultimo_acceso: new Date("2026-10-14T13:00:00.000Z"),
  empleado: {
    id: "00000000-0000-4000-8000-000000000005",
    nro_documento: "72849170",
    nombre_completo: "Roberto Carlos Benavides",
    cargo: "Especialista de RRHH",
    area: "Recursos Humanos",
  },
};
