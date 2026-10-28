import { FilterSelect } from "@/components/filters/FilterSelect";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { type SelectOption } from "@/lib/types/options.types";
import type {
  EmpleadoFilterKey,
  EmpleadoFilters,
} from "@/features/empleados/types/empleados.types";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import { ACTIVO_FILTER_OPTIONS } from "@/components/filters/filters.config";
import { SearchInput } from "@/components/filters/SearchInput";

interface EmpleadosToolbarProps {
  filters: EmpleadoFilters;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: EmpleadoFilterKey, value: string | undefined) => void;
  onClear: () => void;
}

const NO_OPTIONS: SelectOption[] = [];

/**
 * Barra con la búsqueda y los filtros del listado de empleados
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL
 */
export function EmpleadosToolbar({
  filters,
  hasActiveFilters,
  onSearchChange,
  onFilterChange,
  onClear,
}: EmpleadosToolbarProps) {
  const { areas, cargos, jornadas } = useEmpleadosCatalogos(filters.area_id);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
      <SearchInput
        value={filters.search ?? ""}
        onSearch={onSearchChange}
        placeholder="Buscar por nombre, documento o correo"
        ariaLabel="Buscar empleados"
      />

      <FilterSelect
        ariaLabel="Filtrar por área"
        allLabel="Todas las áreas"
        options={areas.data ?? NO_OPTIONS}
        value={filters.area_id}
        onChange={(value) => onFilterChange("area_id", value)}
        isLoading={areas.isLoading}
      />
      <FilterSelect
        ariaLabel="Filtrar por cargo"
        allLabel="Todos los cargos"
        options={cargos.data ?? NO_OPTIONS}
        value={filters.cargo_id}
        onChange={(value) => onFilterChange("cargo_id", value)}
        isLoading={cargos.isLoading}
      />
      <FilterSelect
        ariaLabel="Filtrar por jornada"
        allLabel="Todas las jornadas"
        options={jornadas.data ?? NO_OPTIONS}
        value={filters.jornada_id}
        onChange={(value) => onFilterChange("jornada_id", value)}
        isLoading={jornadas.isLoading}
      />
      <FilterSelect
        ariaLabel="Filtrar por estado"
        allLabel="Todos los estados"
        options={ACTIVO_FILTER_OPTIONS}
        value={
          filters.activo === undefined ? undefined : String(filters.activo)
        }
        onChange={(value) => onFilterChange("activo", value)}
      />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <XIcon data-icon="inline-start" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
