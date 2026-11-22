import { useSearchParams } from "react-router-dom";

import { getPeriodoActual, parsePeriodo } from "@/lib/periodo.utils";
import { applyParamChanges } from "@/lib/urlParams.utils";

const PERIODO_MINIMO = "1992-01";

/**
 * Lee y actualiza el periodo del dashboard (`?periodo=YYYY-MM`) en la URL
 *
 * @returns El periodo activo y la función para cambiarlo
 *
 * @remarks
 * Si la URL no trae un periodo válido (entre 1992-01 y el mes actual), usa
 * el mes actual sin escribirlo en la URL.
 */
export function useDashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const periodoActual = getPeriodoActual();
  const periodoParseado = parsePeriodo(searchParams.get("periodo"));
  const periodo =
    periodoParseado && periodoParseado >= PERIODO_MINIMO
      ? periodoParseado
      : periodoActual;

  const setPeriodo = (nextPeriodo: string) => {
    setSearchParams((current) =>
      applyParamChanges(current, {
        periodo: nextPeriodo === periodoActual ? undefined : nextPeriodo,
      }),
    );
  };

  return { periodo, setPeriodo };
}
