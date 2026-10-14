import type { AuditListado } from "../types/auditoria.types";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";

/** Registros de lectura para mostrar los cambios antes y despues */
export const AUDITORIA_MOCK: AuditListado[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `b0000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    accion: index % 3 === 0 ? "INSERT" : "UPDATE",
    tabla_afectada: ["empleados", "contrato", "solicitud"][index % 3],
    registro_id: EMPLEADOS_MOCK[index % EMPLEADOS_MOCK.length].id,
    usuario_id: `80000000-0000-4000-8000-${String((index % 2) + 1).padStart(12, "0")}`,
    direccion_ip: "127.0.0.1",
    created_at: `2026-10-14T${String(16 - index).padStart(2, "0")}:20:00.000Z`,
    usuarios: {
      email: index % 2 ? "administracion@example.com" : "rrhh@example.com",
      rol: index % 2 ? "ADMIN" : "RRHH",
    },
    valores_antes: index % 3 === 0 ? null : { estado: "PENDIENTE" },
    valores_despues:
      index % 3 === 0
        ? { nombre: "Registro de ejemplo", activo: true }
        : { estado: "EN_REVISION" },
  }),
);
