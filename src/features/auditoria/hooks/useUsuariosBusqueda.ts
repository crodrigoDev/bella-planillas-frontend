import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { auditoriaService } from "../services/auditoria.service";

// Las cuentas cambian poco: la búsqueda se reutiliza por unos minutos
const USUARIOS_STALE_TIME = 5 * 60_000;

/**
 * Busca usuarios para el filtro "Hecho por" de la auditoría
 *
 * @param search - Nombre, correo o documento a buscar
 * @returns La consulta con los usuarios como opciones de un selector
 *
 * @remarks
 * Mantiene la lista anterior visible mientras llega la nueva, igual que los
 * catálogos con búsqueda, para que el selector no parpadee al teclear.
 */
export function useUsuariosBusqueda(search?: string) {
  return useQuery({
    queryKey: ["auditoria", "usuarios", search ?? ""],
    queryFn: () => auditoriaService.listUsuarios(search),
    staleTime: USUARIOS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}
