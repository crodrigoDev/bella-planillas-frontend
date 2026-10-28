import { useQuery } from "@tanstack/react-query";
import { empleadosCatalogosService } from "../services/empleadosCatalogos.service";

// Los tipos de documento casi no cambian: se reutilizan por 30 minutos
const TIPOS_DOCUMENTO_STALE_TIME = 30 * 60_000;

/**
 * Obtiene los tipos de documento para el formulario de empleados
 */
export function useTiposDocumento() {
  return useQuery({
    queryKey: ["catalogos", "tipos-documento"],
    queryFn: () => empleadosCatalogosService.listTiposDocumento(),
    staleTime: TIPOS_DOCUMENTO_STALE_TIME,
  });
}
