import type { AuditLogDto } from "@jyp/shared-contracts";

export type AuditListado = AuditLogDto & {
  id: string;
  usuario_id: string;
  direccion_ip: string;
  created_at: string;
  usuarios: { email: string; rol: string };
};
