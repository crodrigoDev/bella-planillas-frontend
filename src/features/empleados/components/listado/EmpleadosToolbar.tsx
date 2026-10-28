import { useState } from "react";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";

import { FilterChip } from "@/components/filters/FilterChip";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { ACTIVO_FILTER_OPTIONS } from "@/components/filters/filters.config";
import { SearchInput } from "@/components/filters/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import type {
  EmpleadoFilterKey,
  EmpleadoFilters,
} from "@/features/empleados/types/empleados.types";
import { getOptionLabel } from "@/lib/catalogos.utils";
import type { SelectOption } from "@/lib/types/options.types";

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
 * No guarda los filtros, los recibe de la URL. Los selectores están ocultos
 * detrás del botón "Filtros"; los que estén aplicados se ven siempre como
 * etiquetas que se pueden quitar una a una.
 */
export function EmpleadosToolbar({
  filters,
  hasActiveFilters,
  onSearchChange,
  onFilterChange,
  onClear,
}: EmpleadosToolbarProps) {
  const { areas, cargos, jornadas } = useEmpleadosCatalogos(filters.area_id);
  const [open, setOpen] = useState(false);

  const appliedFilters: { key: EmpleadoFilterKey; label: string }[] = [];

  if (filters.area_id)
    appliedFilters.push({
      key: "area_id",
      label: `Área: ${getOptionLabel(areas.data, filters.area_id)}`,
    });
  if (filters.cargo_id)
    appliedFilters.push({
      key: "cargo_id",
      label: `Cargo: ${getOptionLabel(cargos.data, filters.cargo_id)}`,
    });
  if (filters.jornada_id)
    appliedFilters.push({
      key: "jornada_id",
      label: `Jornada: ${getOptionLabel(jornadas.data, filters.jornada_id)}`,
    });
  if (filters.activo !== undefined)
    appliedFilters.push({
      key: "activo",
      label: `Estado: ${getOptionLabel(ACTIVO_FILTER_OPTIONS, String(filters.activo))}`,
    });

  return (
    <div className="space-y-3 rounded-lg border bg-card p-3">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            className="sm:w-96"
            value={filters.search ?? ""}
            onSearch={onSearchChange}
            placeholder="Buscar por nombre, documento o correo"
            ariaLabel="Buscar empleados"
          />

          <CollapsibleTrigger render={<Button variant="outline" />}>
            <SlidersHorizontalIcon data-icon="inline-start" />
            Filtros
            {appliedFilters.length > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {appliedFilters.length}
              </span>
            )}
          </CollapsibleTrigger>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClear}>
              <XIcon data-icon="inline-start" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="flex flex-wrap items-center gap-2 pt-3">
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
                filters.activo === undefined
                  ? undefined
                  : String(filters.activo)
              }
              onChange={(value) => onFilterChange("activo", value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {appliedFilters.map(({ key, label }) => (
            <FilterChip
              key={key}
              label={label}
              onRemove={() => onFilterChange(key, undefined)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
