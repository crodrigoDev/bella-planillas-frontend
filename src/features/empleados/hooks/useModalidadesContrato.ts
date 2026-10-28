import { useCatalogo } from "@/hooks/useCatalogo";
import { empleadosCatalogosService } from "../services/empleadosCatalogos.service";

/**
 * Obtiene las modalidades de contrato para el paso 3 del registro
 */
export function useModalidadesContrato() {
  return useCatalogo(["modalidades-contrato"], () =>
    empleadosCatalogosService.listModalidadesContrato(),
  );
}
