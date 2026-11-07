import { useState } from "react";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";

import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
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
import { formatDate } from "@/lib/format.utils";
import type { SelectOption } from "@/lib/types/options.types";
import { TIPO_OPTIONS } from "../../config/solicitudes.config";
import type {
  SolicitudFilterKey,
  SolicitudFilters,
} from "../../types/solicitudes.types";

interface SolicitudesToolbarProps {
  filters: SolicitudFilters;
  hasActiveFilters: boolean;
  /** Áreas activas; las trae la página para no depender de otra feature */
  areas: SelectOption[] | undefined;
  areasLoading: boolean;
  onFilterChange: (key: SolicitudFilterKey, value: string | undefined) => void;
  onFechasChange: (desde: string | undefined, hasta: string | undefined) => void;
  onClear: () => void;
}

/**
 * Barra con la búsqueda y los filtros del listado de solicitudes
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL. Los selectores están ocultos
 * detrás del botón "Filtros"; los aplicados se ven siempre como etiquetas que
 * se pueden quitar una a una. El estado no está aquí: son las pestañas.
 */
export function SolicitudesToolbar({
  filters,
  hasActiveFilters,
  areas,
  areasLoading,
  onFilterChange,
  onFechasChange,
  onClear,
}: SolicitudesToolbarProps) {
  const [open, setOpen] = useState(false);

  const appliedFilters: { key: string; label: string; onRemove: () => void }[] =
    [];

  if (filters.tipo)
    appliedFilters.push({
      key: "tipo",
      label: `Tipo: ${getOptionLabel(TIPO_OPTIONS, filters.tipo)}`,
      onRemove: () => onFilterChange("tipo", undefined),
    });
  if (filters.area_id)
    appliedFilters.push({
      key: "area_id",
      label: `Área: ${getOptionLabel(areas, filters.area_id)}`,
      onRemove: () => onFilterChange("area_id", undefined),
    });
  if (filters.fecha_desde || filters.fecha_hasta)
    appliedFilters.push({
      key: "fechas",
      label: `Registrada: ${filters.fecha_desde ? formatDate(filters.fecha_desde) : "..."} - ${filters.fecha_hasta ? formatDate(filters.fecha_hasta) : "..."}`,
      onRemove: () => onFechasChange(undefined, undefined),
    });

  return (
    <div className="space-y-3">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            className="flex-1 sm:w-auto sm:min-w-72"
            value={filters.search ?? ""}
            onSearch={(value) => onFilterChange("search", value)}
            placeholder="Buscar por código, motivo o colaborador"
            ariaLabel="Buscar solicitudes"
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
              ariaLabel="Filtrar por tipo"
              allLabel="Todos los tipos"
              options={TIPO_OPTIONS}
              value={filters.tipo}
              onChange={(value) => onFilterChange("tipo", value)}
            />
            <FilterSelect
              ariaLabel="Filtrar por área"
              allLabel="Todas las áreas"
              options={areas ?? []}
              value={filters.area_id}
              onChange={(value) => onFilterChange("area_id", value)}
              isLoading={areasLoading}
            />
            <DateRangeFilter
              ariaLabel="Filtrar por fecha de registro"
              placeholder="Fecha de registro"
              from={filters.fecha_desde}
              to={filters.fecha_hasta}
              onChange={onFechasChange}
              className="w-full sm:w-64"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {appliedFilters.map(({ key, label, onRemove }) => (
            <FilterChip key={key} label={label} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
