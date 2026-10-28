import { useCatalogo } from "@/hooks/useCatalogo";
import { datosFinancierosCatalogosService } from "../services/datosFinancierosCatalogos.service";

/**
 * Obtiene las opciones del formulario de datos financieros
 *
 * @returns Una consulta por cada catálogo
 */
export function useDatosFinancierosCatalogos() {
  const regimenes = useCatalogo(["regimenes-pension"], () =>
    datosFinancierosCatalogosService.listRegimenesPension(),
  );

  const afps = useCatalogo(["afps"], () =>
    datosFinancierosCatalogosService.listAfps(),
  );

  const bancos = useCatalogo(["bancos"], () =>
    datosFinancierosCatalogosService.listBancos(),
  );

  return { regimenes, afps, bancos };
}
