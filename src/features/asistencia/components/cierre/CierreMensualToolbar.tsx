import { XIcon } from "lucide-react";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { SearchInput } from "@/components/filters/SearchInput";
import { Button } from "@/components/ui/button";
import type { SelectOption } from "@/lib/types/options.types";
import { ESTADO_RESUMEN_OPTIONS } from "../../config/cierreMensual.config";
import type {
  IncidenciaFilterKey,
  IncidenciaFilters,
} from "../../types/incidencias.types";
import { SelectorMes } from "../SelectorMes";

interface CierreMensualToolbarProps {
  filters: IncidenciaFilters;
  hasActiveFilters: boolean;
  /** Áreas activas; las trae la página para no depender de otra feature */
  areas: SelectOption[] | undefined;
  areasLoading: boolean;
  onPeriodoChange: (periodo: string) => void;
  onFilterChange: (key: IncidenciaFilterKey, value: string | undefined) => void;
  onClear: () => void;
}

/**
 * Barra con el mes y los filtros del cierre mensual
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL. "Limpiar filtros" no cambia el mes.
 */
export function CierreMensualToolbar({
  filters,
  hasActiveFilters,
  areas,
  areasLoading,
  onPeriodoChange,
  onFilterChange,
  onClear,
}: CierreMensualToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SelectorMes periodo={filters.periodo} onChange={onPeriodoChange} />
      <FilterSelect
        ariaLabel="Filtrar por área"
        allLabel="Todas las áreas"
        options={areas ?? []}
        value={filters.area_id}
        onChange={(value) => onFilterChange("area_id", value)}
        isLoading={areasLoading}
      />
      <FilterSelect
        ariaLabel="Filtrar por estado"
        allLabel="Todos los estados"
        options={ESTADO_RESUMEN_OPTIONS}
        value={filters.estado}
        onChange={(value) => onFilterChange("estado", value)}
      />
      <SearchInput
        className="flex-1 sm:w-auto sm:min-w-72"
        value={filters.busqueda ?? ""}
        onSearch={(value) => onFilterChange("busqueda", value)}
        placeholder="Buscar por nombre o documento"
        ariaLabel="Buscar colaboradores"
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
