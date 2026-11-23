import { XIcon } from "lucide-react";

import { FilterSelect } from "@/components/filters/FilterSelect";
import { SearchInput } from "@/components/filters/SearchInput";
import { Button } from "@/components/ui/button";
import type { SelectOption } from "@/lib/types/options.types";

interface CargosToolbarProps {
  search: string | undefined;
  areaId: string | undefined;
  hasActiveFilters: boolean;
  /** Áreas activas; las trae la página para no depender de otra feature */
  areas: SelectOption[];
  areasLoading: boolean;
  onSearchChange: (value: string) => void;
  onAreaChange: (value: string | undefined) => void;
  onClear: () => void;
}

/**
 * Barra de búsqueda y filtro por área del listado de cargos
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL.
 */
export function CargosToolbar({
  search,
  areaId,
  hasActiveFilters,
  areas,
  areasLoading,
  onSearchChange,
  onAreaChange,
  onClear,
}: CargosToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        className="w-full sm:w-80"
        value={search ?? ""}
        onSearch={onSearchChange}
        placeholder="Buscar por nombre o descripción"
        ariaLabel="Buscar cargos"
      />

      <FilterSelect
        ariaLabel="Filtrar por área"
        allLabel="Todas las áreas"
        options={areas}
        value={areaId}
        onChange={onAreaChange}
        isLoading={areasLoading}
      />

      {hasActiveFilters && (
        <Button variant="ghost" size="lg" onClick={onClear}>
          <XIcon data-icon="inline-start" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
