import { XIcon } from "lucide-react";

import { FilterChip } from "@/components/filters/FilterChip";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Button } from "@/components/ui/button";
import {
  ACCION_OPTIONS,
  getAccionLabel,
  getTablaLabel,
  TABLA_OPTIONS,
} from "../../config/auditoria.config";
import type {
  AuditoriaFilterKey,
  AuditoriaFilters,
} from "../../types/auditoria.types";
import { shortId } from "../../utils/auditoria.utils";

interface AuditoriaToolbarProps {
  filters: AuditoriaFilters;
  /** Correo del usuario filtrado; solo sirve para la etiqueta */
  usuarioEmail: string | undefined;
  hasActiveFilters: boolean;
  onFilterChange: (key: AuditoriaFilterKey, value: string | undefined) => void;
  onQuitarUsuario: () => void;
  onQuitarRegistro: () => void;
  onClear: () => void;
}

/**
 * Barra con los filtros de la bitácora de auditoría
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL. Módulo y acción son selectores
 * siempre visibles; el usuario y el registro se filtran desde una fila y solo se
 * ven como etiquetas, igual que los demás filtros aplicados.
 */
export function AuditoriaToolbar({
  filters,
  usuarioEmail,
  hasActiveFilters,
  onFilterChange,
  onQuitarUsuario,
  onQuitarRegistro,
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
  if (filters.usuario_id)
    appliedFilters.push({
      key: "usuario_id",
      label: `Usuario: ${usuarioEmail ?? shortId(filters.usuario_id)}`,
      onRemove: onQuitarUsuario,
    });
  if (filters.registro_id)
    appliedFilters.push({
      key: "registro_id",
      label: `Registro: ${shortId(filters.registro_id)}`,
      onRemove: onQuitarRegistro,
    });

  // El filtro de módulo y de acción acepta cualquier texto de la URL: si no es
  // una opción conocida, se agrega para que el selector lo muestre
  const tablaOptions = withCurrent(TABLA_OPTIONS, filters.tabla_afectada);
  const accionOptions = withCurrent(ACCION_OPTIONS, filters.accion);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          ariaLabel="Filtrar por módulo"
          allLabel="Todos los módulos"
          options={tablaOptions}
          value={filters.tabla_afectada}
          onChange={(value) => onFilterChange("tabla_afectada", value)}
        />
        <FilterSelect
          ariaLabel="Filtrar por acción"
          allLabel="Todas las acciones"
          options={accionOptions}
          value={filters.accion}
          onChange={(value) => onFilterChange("accion", value)}
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

/** Agrega el valor actual a las opciones si no es una de ellas */
const withCurrent = (
  options: { value: string; label: string }[],
  current: string | undefined,
) =>
  current && !options.some((option) => option.value === current)
    ? [...options, { value: current, label: current }]
    : options;
