import { XIcon } from "lucide-react";

import { ColaboradorSelect } from "@/components/form/ColaboradorSelect";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { FilterChip } from "@/components/filters/FilterChip";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format.utils";
import type { ColaboradorOption } from "@/lib/types/options.types";
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
  TipoAfectadoAuditoria,
} from "../../types/auditoria.types";

interface AuditoriaToolbarProps {
  filters: AuditoriaFilters;
  /** Resultado de la búsqueda de colaboradores afectados; lo trae la página para no depender de otra feature */
  empleados: ColaboradorOption[];
  empleadosLoading: boolean;
  /** Resultado de la búsqueda de usuarios; lo trae la página */
  usuarios: ColaboradorOption[];
  usuariosLoading: boolean;
  /** Nombre del usuario filtrado; solo sirve para la etiqueta */
  usuarioNombre: string | undefined;
  /** Nombre del afectado filtrado; solo sirve para la etiqueta */
  afectadoNombre: string | undefined;
  hasActiveFilters: boolean;
  /** Se llama con el texto a buscar cuando el usuario deja de teclear */
  onAfectadoSearchChange: (search: string) => void;
  /** Se llama con el texto a buscar cuando el usuario deja de teclear */
  onUsuarioSearchChange: (search: string) => void;
  onFilterChange: (key: AuditoriaFilterKey, value: string | undefined) => void;
  onFechasChange: (desde: string | undefined, hasta: string | undefined) => void;
  onFiltrarUsuario: (usuarioId: string, nombre: string) => void;
  onQuitarUsuario: () => void;
  onFiltrarAfectado: (
    tipo: TipoAfectadoAuditoria,
    id: string,
    nombre: string,
  ) => void;
  onQuitarAfectado: () => void;
  onClear: () => void;
}

/**
 * Barra con los filtros de la actividad de auditoría
 *
 * @remarks
 * No guarda los filtros, los recibe de la URL. El colaborador afectado y quién
 * hizo el cambio se buscan desde la barra (el propio buscador muestra lo
 * elegido); el afectado de otro tipo (área, cargo o jornada) se filtra desde
 * una fila y se ve como etiqueta. Módulo, acción y fechas son controles siempre
 * visibles, y los filtros aplicados se pueden quitar uno a uno.
 */
export function AuditoriaToolbar({
  filters,
  empleados,
  empleadosLoading,
  usuarios,
  usuariosLoading,
  usuarioNombre,
  afectadoNombre,
  hasActiveFilters,
  onAfectadoSearchChange,
  onUsuarioSearchChange,
  onFilterChange,
  onFechasChange,
  onFiltrarUsuario,
  onQuitarUsuario,
  onFiltrarAfectado,
  onQuitarAfectado,
  onClear,
}: AuditoriaToolbarProps) {
  const appliedFilters: { key: string; label: string; onRemove: () => void }[] =
    [];

  /** El select entrega solo el id: el nombre se toma de la opción elegida para la URL */
  const handleAfectadoChange = (value: string | undefined) => {
    if (!value) {
      onQuitarAfectado();
      return;
    }

    const nombre = empleados.find((option) => option.value === value)?.label ?? "";
    onFiltrarAfectado("empleado", value, nombre);
  };

  /** El select entrega solo el id: el nombre se toma de la opción elegida para la URL */
  const handleUsuarioChange = (value: string | undefined) => {
    if (!value) {
      onQuitarUsuario();
      return;
    }

    const nombre = usuarios.find((option) => option.value === value)?.label ?? "";
    onFiltrarUsuario(value, nombre);
  };

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
  // El afectado colaborador ya se ve en su buscador; los demás solo en la etiqueta
  if (
    filters.afectado_tipo &&
    filters.afectado_tipo !== "empleado" &&
    filters.afectado_id
  )
    appliedFilters.push({
      key: "afectado_id",
      label: `${TIPO_AFECTADO_LABEL[filters.afectado_tipo]}: ${afectadoNombre ?? "elegido"}`,
      onRemove: onQuitarAfectado,
    });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-64">
          <ColaboradorSelect
            ariaLabel="Filtrar por colaborador afectado"
            placeholder="Todos los afectados"
            value={
              filters.afectado_tipo === "empleado"
                ? filters.afectado_id
                : undefined
            }
            onChange={handleAfectadoChange}
            options={empleados}
            isLoading={empleadosLoading}
            onSearchChange={onAfectadoSearchChange}
            selectedLabel={afectadoNombre}
          />
        </div>
        <div className="w-full sm:w-64">
          <ColaboradorSelect
            ariaLabel="Filtrar por quién hizo el cambio"
            placeholder="Todos los usuarios"
            value={filters.usuario_id}
            onChange={handleUsuarioChange}
            options={usuarios}
            isLoading={usuariosLoading}
            onSearchChange={onUsuarioSearchChange}
            selectedLabel={usuarioNombre}
          />
        </div>
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
