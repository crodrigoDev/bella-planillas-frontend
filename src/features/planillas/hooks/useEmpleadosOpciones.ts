import { useMemo, useState } from "react";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import {
  useEmpleadosActivosPlanillas,
  useEmpleadosCatalogoPlanillas,
} from "./useCatalogos";

const BUSQUEDA_DEBOUNCE_MS = 300;

/**
 * Provee opciones de colaboradores activos con búsqueda con debounce para combobox
 */
export function useEmpleadosBusqueda() {
  const [search, setSearch] = useState("");
  const { run: debouncedSearch, cancel } = useDebouncedCallback(
    (next: string) => setSearch(next.trim()),
    BUSQUEDA_DEBOUNCE_MS,
  );

  const query = useEmpleadosActivosPlanillas(search);

  const resetSearch = () => {
    cancel();
    setSearch("");
  };

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    onSearchChange: debouncedSearch,
    resetSearch,
  };
}

/**
 * Carga hasta 100 colaboradores para resolver nombres a partir de su identificador
 */
export function useEmpleadosMapa() {
  const query = useEmpleadosCatalogoPlanillas();

  const nombresPorId = useMemo(() => {
    const mapa = new Map<string, string>();

    for (const empleado of query.data ?? []) {
      mapa.set(empleado.id, empleado.nombreCompleto);
    }

    return mapa;
  }, [query.data]);

  return {
    ...query,
    nombresPorId,
  };
}
