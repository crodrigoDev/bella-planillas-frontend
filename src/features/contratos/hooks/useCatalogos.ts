import { useCatalogo } from "@/hooks/useCatalogo";
import { contratosCatalogosService } from "../services/catalogos.service";

/** Obtiene las modalidades de contrato */
export function useModalidadesContrato() {
  return useCatalogo(["modalidades-contrato"], () =>
    contratosCatalogosService.listModalidades(),
  );
}
