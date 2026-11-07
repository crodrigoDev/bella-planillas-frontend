// El rol llega como texto: perfil no importa los tipos de otra feature
const ROL_LABELS: Record<string, string> = {
  JYP: "JyP",
  ADMIN: "Administrador",
  CONTADOR: "Contador",
  RRHH: "Recursos Humanos",
  ASISTENTE: "Asistente",
  EMPLEADO: "Empleado",
};

/** Nombre legible de un rol; uno desconocido se muestra tal cual */
export const getRolLabel = (rol: string): string => ROL_LABELS[rol] ?? rol;
