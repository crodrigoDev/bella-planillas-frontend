import { useCatalogo } from "@/hooks/useCatalogo";
import { empleadosCatalogosService } from "../services/empleadosCatalogos.service";

/**
 * Obtiene los tipos de documento para el formulario de empleados
 */
export function useTiposDocumento() {
  return useCatalogo(["tipos-documento"], () =>
    empleadosCatalogosService.listTiposDocumento(),
  );
}
