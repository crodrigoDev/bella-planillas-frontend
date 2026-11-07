/** Colaborador vinculado a la cuenta */
export interface PerfilEmpleado {
  id: string;
  nro_documento: string;
  nombre_completo: string;
  cargo: string;
  area: string;
}

/**
 * Perfil del usuario con sesión (`GET /usuarios/me`)
 *
 * @remarks
 * `ultimo_acceso` llega como texto ISO (el contrato lo declara como fecha).
 * `empleado` es null si la cuenta no tiene colaborador asociado.
 */
export interface MiPerfil {
  id: string;
  email: string;
  rol: string;
  ultimo_acceso: string | null;
  empleado: PerfilEmpleado | null;
}
