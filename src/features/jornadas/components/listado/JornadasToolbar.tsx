import { useState } from "react";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";

import { FilterChip } from "@/components/filters/FilterChip";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { SearchInput } from "@/components/filters/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getOptionLabel } from "@/lib/catalogos.utils";
import type { SelectOption } from "@/lib/types/options.types";
import {
  DURACION_OPTIONS,
  MODALIDAD_OPTIONS,
  TURNO_OPTIONS,
} from "../../config/jornadas.config";
import type {
  JornadaFilterKey,
  JornadaFilters,
} from "../../types/jornadas.types";

interface JornadasToolbarProps {
  filters: JornadaFilters;
  hasActiveFilters: boolean;
  /** Áreas activas; las trae la página para no depender de otra feature */
  areas: SelectOption[] | undefined;
  areasLoading: boolean;
  onFilterChange: (key: JornadaFilterKey, value: string | undefined) => void;
  onClear: () => void;
}

/**
 * Barra con la búsqueda y los filtros del listado de jornadas
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL. Los selectores están ocultos
 * detrás del botón "Filtros"; los aplicados se ven siempre como etiquetas que
 * se pueden quitar una a una (igual que en empleados).
 */
export function JornadasToolbar({
  filters,
  hasActiveFilters,
  areas,
  areasLoading,
  onFilterChange,
  onClear,
}: JornadasToolbarProps) {
  const [open, setOpen] = useState(false);

  const appliedFilters: { key: JornadaFilterKey; label: string }[] = [];

  if (filters.area_id)
    appliedFilters.push({
      key: "area_id",
      label: `Área: ${getOptionLabel(areas, filters.area_id)}`,
    });
  if (filters.turno)
    appliedFilters.push({
      key: "turno",
      label: `Turno: ${getOptionLabel(TURNO_OPTIONS, filters.turno)}`,
    });
  if (filters.modalidad)
    appliedFilters.push({
      key: "modalidad",
      label: `Modalidad: ${getOptionLabel(MODALIDAD_OPTIONS, filters.modalidad)}`,
    });
  if (filters.duracion)
    appliedFilters.push({
      key: "duracion",
      label: `Duración: ${getOptionLabel(DURACION_OPTIONS, filters.duracion)}`,
    });

  return (
    <div className="space-y-3">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            className="flex-1 sm:w-auto sm:min-w-72"
            value={filters.search ?? ""}
            onSearch={(value) => onFilterChange("search", value)}
            placeholder="Buscar por nombre o descripción"
            ariaLabel="Buscar jornadas"
          />

          <CollapsibleTrigger render={<Button variant="outline" size="lg" />}>
            <SlidersHorizontalIcon data-icon="inline-start" />
            Filtros
            {appliedFilters.length > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {appliedFilters.length}
              </span>
            )}
          </CollapsibleTrigger>

          {hasActiveFilters && (
            <Button variant="ghost" size="lg" onClick={onClear}>
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
              options={areas ?? []}
              value={filters.area_id}
              onChange={(value) => onFilterChange("area_id", value)}
              isLoading={areasLoading}
            />
            <FilterSelect
              ariaLabel="Filtrar por turno"
              allLabel="Todos los turnos"
              options={TURNO_OPTIONS}
              value={filters.turno}
              onChange={(value) => onFilterChange("turno", value)}
            />
            <FilterSelect
              ariaLabel="Filtrar por modalidad"
              allLabel="Todas las modalidades"
              options={MODALIDAD_OPTIONS}
              value={filters.modalidad}
              onChange={(value) => onFilterChange("modalidad", value)}
            />
            <FilterSelect
              ariaLabel="Filtrar por duración"
              allLabel="Todas las duraciones"
              options={DURACION_OPTIONS}
              value={filters.duracion}
              onChange={(value) => onFilterChange("duracion", value)}
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
