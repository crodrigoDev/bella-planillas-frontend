import { XIcon } from "lucide-react";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { FilterChip } from "@/components/filters/FilterChip";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Button } from "@/components/ui/button";
import type { ColaboradorOption } from "@/lib/types/options.types";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import { TIPO_MARCA_FILTRO_OPTIONS } from "../../config/marcaciones.config";
import { ColaboradorSelect } from "@/components/form/ColaboradorSelect";
import type {
  MarcacionFilterKey,
  MarcacionFilters,
} from "../../types/marcaciones.types";

interface MarcacionesToolbarProps {
  filters: MarcacionFilters;
  hasActiveFilters: boolean;
  /** Resultado de la búsqueda de colaboradores; lo trae la página para no depender de otra feature */
  empleados: ColaboradorOption[];
  empleadosLoading: boolean;
  /** Nombre del colaborador filtrado, que la página busca por su id */
  colaboradorNombre: string | undefined;
  /** Se llama con el texto a buscar cuando el usuario deja de teclear */
  onEmpleadoSearchChange: (search: string) => void;
  onFilterChange: (key: MarcacionFilterKey, value: string | undefined) => void;
  onFechasChange: (inicio: string | undefined, fin: string | undefined) => void;
  onClear: () => void;
}

/**
 * Barra con los filtros del listado de marcaciones
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL. Los filtros aplicados se ven
 * como etiquetas que se pueden quitar una a una.
 */
export function MarcacionesToolbar({
  filters,
  hasActiveFilters,
  empleados,
  empleadosLoading,
  colaboradorNombre,
  onEmpleadoSearchChange,
  onFilterChange,
  onFechasChange,
  onClear,
}: MarcacionesToolbarProps) {
  const appliedFilters: { key: MarcacionFilterKey; label: string }[] = [];

  if (filters.empleado_id)
    appliedFilters.push({
      key: "empleado_id",
      label: colaboradorNombre
        ? `Colaborador: ${colaboradorNombre}`
        : "Colaborador",
    });
  if (filters.fecha_inicio)
    appliedFilters.push({
      key: "fecha_inicio",
      label: `Desde: ${formatDate(filters.fecha_inicio)}`,
    });
  if (filters.fecha_fin)
    appliedFilters.push({
      key: "fecha_fin",
      label: `Hasta: ${formatDate(filters.fecha_fin)}`,
    });
  if (filters.tipo_marcacion)
    appliedFilters.push({
      key: "tipo_marcacion",
      label: `Tipo: ${getOptionLabel(TIPO_MARCA_FILTRO_OPTIONS, filters.tipo_marcacion)}`,
    });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-64">
          <ColaboradorSelect
            ariaLabel="Filtrar por colaborador"
            placeholder="Todos los colaboradores"
            value={filters.empleado_id}
            onChange={(value) => onFilterChange("empleado_id", value)}
            options={empleados}
            isLoading={empleadosLoading}
            onSearchChange={onEmpleadoSearchChange}
            selectedLabel={colaboradorNombre}
          />
        </div>
        <DateRangeFilter
          ariaLabel="Filtrar por rango de fechas"
          placeholder="Rango de fechas"
          from={filters.fecha_inicio}
          to={filters.fecha_fin}
          onChange={onFechasChange}
          className="w-full sm:w-64"
        />
        <FilterSelect
          ariaLabel="Filtrar por tipo de marcación"
          allLabel="Todos los tipos"
          options={TIPO_MARCA_FILTRO_OPTIONS}
          value={filters.tipo_marcacion}
          onChange={(value) => onFilterChange("tipo_marcacion", value)}
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
