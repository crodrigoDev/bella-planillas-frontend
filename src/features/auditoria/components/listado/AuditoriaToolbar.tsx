import { XIcon } from "lucide-react";

import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { FilterChip } from "@/components/filters/FilterChip";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format.utils";
import {
  ACCION_OPTIONS,
  getAccionLabel,
  getTablaLabel,
  TABLA_OPTIONS,
  TIPO_AFECTADO_LABEL,
} from "../../config/auditoria.config";
import type {
  AuditoriaFilterKey,
  AuditoriaFilters,
} from "../../types/auditoria.types";

interface AuditoriaToolbarProps {
  filters: AuditoriaFilters;
  /** Nombre del usuario filtrado; solo sirve para la etiqueta */
  usuarioNombre: string | undefined;
  /** Nombre del afectado filtrado; solo sirve para la etiqueta */
  afectadoNombre: string | undefined;
  hasActiveFilters: boolean;
  onFilterChange: (key: AuditoriaFilterKey, value: string | undefined) => void;
  onFechasChange: (desde: string | undefined, hasta: string | undefined) => void;
  onQuitarUsuario: () => void;
  onQuitarAfectado: () => void;
  onClear: () => void;
}

/**
 * Barra con los filtros de la actividad de auditoría
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL. Módulo, acción y fechas son
 * controles siempre visibles; el usuario y el afectado se filtran desde una fila
 * y solo se ven como etiquetas, igual que los demás filtros aplicados.
 */
export function AuditoriaToolbar({
  filters,
  usuarioNombre,
  afectadoNombre,
  hasActiveFilters,
  onFilterChange,
  onFechasChange,
  onQuitarUsuario,
  onQuitarAfectado,
  onClear,
}: AuditoriaToolbarProps) {
  const appliedFilters: { key: string; label: string; onRemove: () => void }[] =
    [];

  if (filters.tabla_afectada)
    appliedFilters.push({
      key: "tabla_afectada",
      label: `Módulo: ${getTablaLabel(filters.tabla_afectada)}`,
      onRemove: () => onFilterChange("tabla_afectada", undefined),
    });
  if (filters.accion)
    appliedFilters.push({
      key: "accion",
      label: `Acción: ${getAccionLabel(filters.accion)}`,
      onRemove: () => onFilterChange("accion", undefined),
    });
  if (filters.desde || filters.hasta)
    appliedFilters.push({
      key: "fechas",
      label: `Fecha: ${filters.desde ? formatDate(filters.desde) : "..."} - ${filters.hasta ? formatDate(filters.hasta) : "..."}`,
      onRemove: () => onFechasChange(undefined, undefined),
    });
  if (filters.usuario_id)
    appliedFilters.push({
      key: "usuario_id",
      label: `Hecho por: ${usuarioNombre ?? "usuario elegido"}`,
      onRemove: onQuitarUsuario,
    });
  if (filters.afectado_tipo && filters.afectado_id)
    appliedFilters.push({
      key: "afectado_id",
      label: `${TIPO_AFECTADO_LABEL[filters.afectado_tipo]}: ${afectadoNombre ?? "elegido"}`,
      onRemove: onQuitarAfectado,
    });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          ariaLabel="Filtrar por módulo"
          allLabel="Todos los módulos"
          options={TABLA_OPTIONS}
          value={filters.tabla_afectada}
          onChange={(value) => onFilterChange("tabla_afectada", value)}
          className="sm:w-64"
        />
        <FilterSelect
          ariaLabel="Filtrar por acción"
          allLabel="Todas las acciones"
          options={ACCION_OPTIONS}
          value={filters.accion}
          onChange={(value) => onFilterChange("accion", value)}
          className="sm:w-64"
        />
        <DateRangeFilter
          ariaLabel="Filtrar por fecha"
          placeholder="Fecha"
          from={filters.desde}
          to={filters.hasta}
          onChange={onFechasChange}
          className="w-full sm:w-64"
        />

        {hasActiveFilters && (
          <Button variant="ghost" size="lg" onClick={onClear}>
            <XIcon data-icon="inline-start" />
            Limpiar filtros
          </Button>
        )}
      </div>

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
