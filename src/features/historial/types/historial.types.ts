import type { PaginationMeta } from "@/lib/api/types/api.types";
import type { CambioCampo } from "@/lib/types/cambios.types";

/** Quién hizo el cambio; el backend usa "Sistema" de nombre si el usuario no tiene colaborador */
export interface UsuarioHistorial {
  id: string;
  nombre: string;
  rol: string;
}

/**
 * Un hecho del historial de un registro (`GET /core/audit/historial/:tabla/:registroId`)
 *
 * @remarks
 * Sale de una fila de auditoría. `cambios` ya viene calculado por el backend
 * con la etiqueta de cada campo; `usuario` es null si lo hizo el sistema.
 */
export interface EventoHistorial {
  id: string;
  /** Instante completo con zona (ISO) */
  fecha: string;
  accion: string;
  tabla_afectada: string;
  registro_id: string;
  usuario: UsuarioHistorial | null;
  cambios: CambioCampo[];
  campos_modificados: string[];
}

/** Página del historial con sus datos de paginación */
export interface HistorialPage {
  items: EventoHistorial[];
  pagination: PaginationMeta;
}
