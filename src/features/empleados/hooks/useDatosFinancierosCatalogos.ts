import { useQuery } from "@tanstack/react-query";
import { datosFinancierosCatalogosService } from "../services/datosFinancierosCatalogos.service";

// Los regímenes, AFP y bancos casi no cambian: se reutilizan por 30 minutos
const CATALOGO_STALE_TIME = 30 * 60_000;

/**
 * Obtiene las opciones del formulario de datos financieros
 *
 * @returns Una consulta por cada catálogo
 */
export function useDatosFinancierosCatalogos() {
  const regimenes = useQuery({
    queryKey: ["catalogos", "regimenes-pension"],
    queryFn: () => datosFinancierosCatalogosService.listRegimenesPension(),
    staleTime: CATALOGO_STALE_TIME,
  });

  const afps = useQuery({
    queryKey: ["catalogos", "afps"],
    queryFn: () => datosFinancierosCatalogosService.listAfps(),
    staleTime: CATALOGO_STALE_TIME,
  });

  const bancos = useQuery({
    queryKey: ["catalogos", "bancos"],
    queryFn: () => datosFinancierosCatalogosService.listBancos(),
    staleTime: CATALOGO_STALE_TIME,
  });

  return { regimenes, afps, bancos };
}
