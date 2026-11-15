import { XIcon } from "lucide-react";

import { FilterChip } from "@/components/filters/FilterChip";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { SearchInput } from "@/components/filters/SearchInput";
import { Button } from "@/components/ui/button";
import { getOptionLabel } from "@/lib/catalogos.utils";
import type { SelectOption } from "@/lib/types/options.types";
import {
  ESTADO_FILTRO_OPTIONS,
  POR_VENCER_OPTIONS,
} from "../../config/contratos.config";
import type {
  ContratoFilterKey,
  ContratoFilters,
} from "../../types/contratos.types";

interface ContratosToolbarProps {
  filters: ContratoFilters;
  hasActiveFilters: boolean;
  /** Áreas del filtro; las trae la página para no depender de otra feature */
  areas: SelectOption[];
  areasLoading: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: ContratoFilterKey, value: string | undefined) => void;
  onClear: () => void;
}

/**
 * Barra con la búsqueda y los filtros del listado global de contratos
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL. Con "Por vencer" el backend
 * solo trae contratos vigentes: el filtro de estado queda fijo en Vigente y
 * deshabilitado, y un texto lo explica. Los filtros aplicados se ven como
 * etiquetas que se pueden quitar una a una.
 */
export function ContratosToolbar({
  filters,
  hasActiveFilters,
  areas,
  areasLoading,
  onSearchChange,
  onFilterChange,
  onClear,
}: ContratosToolbarProps) {
  const porVencer = filters.por_vencer_dias !== undefined;
  const porVencerValue = porVencer
    ? String(filters.por_vencer_dias)
    : undefined;

  const appliedFilters: { key: ContratoFilterKey; label: string }[] = [];

  if (filters.estado)
    appliedFilters.push({
      key: "estado",
      label: `Estado: ${getOptionLabel(ESTADO_FILTRO_OPTIONS, filters.estado)}`,
    });
  if (filters.area_id)
    appliedFilters.push({
      key: "area_id",
      label: `Área: ${getOptionLabel(areas, filters.area_id)}`,
    });
  if (porVencerValue)
    appliedFilters.push({
      key: "por_vencer_dias",
      label: `Por vencer: ${getOptionLabel(POR_VENCER_OPTIONS, porVencerValue)}`,
    });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          className="flex-1 sm:w-auto sm:min-w-72"
          value={filters.search ?? ""}
          onSearch={onSearchChange}
          placeholder="Buscar por colaborador o documento"
          ariaLabel="Buscar contratos"
        />
        <FilterSelect
          ariaLabel="Filtrar por estado"
          allLabel="Todos los estados"
          options={ESTADO_FILTRO_OPTIONS}
          // Con "Por vencer" el backend fuerza Vigente
          value={porVencer ? "VIGENTE" : filters.estado}
          onChange={(value) => onFilterChange("estado", value)}
          disabled={porVencer}
        />
        <FilterSelect
          ariaLabel="Filtrar por área"
          allLabel="Todas las áreas"
          options={areas}
          value={filters.area_id}
          onChange={(value) => onFilterChange("area_id", value)}
          isLoading={areasLoading}
        />
        <FilterSelect
          ariaLabel="Filtrar por vencimiento"
          allLabel="Cualquier vencimiento"
          options={POR_VENCER_OPTIONS}
          value={porVencerValue}
          onChange={(value) => onFilterChange("por_vencer_dias", value)}
        />

        {hasActiveFilters && (
          <Button variant="ghost" size="lg" onClick={onClear}>
            <XIcon data-icon="inline-start" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {porVencer && (
        <p className="text-sm text-muted-foreground">
          Con «Por vencer» solo se muestran los contratos vigentes, del que
          vence primero al que vence después.
        </p>
      )}

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
