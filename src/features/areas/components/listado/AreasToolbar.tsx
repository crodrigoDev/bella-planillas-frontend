import { XIcon } from "lucide-react";

import { SearchInput } from "@/components/filters/SearchInput";
import { Button } from "@/components/ui/button";

interface AreasToolbarProps {
  search: string | undefined;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

/**
 * Barra de búsqueda del listado de áreas
 *
 * @remarks
 * No guarda el filtro, lo recibe de la URL.
 */
export function AreasToolbar({
  search,
  hasActiveFilters,
  onSearchChange,
  onClear,
}: AreasToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        className="w-full sm:w-80"
        value={search ?? ""}
        onSearch={onSearchChange}
        placeholder="Buscar por nombre o descripción"
        ariaLabel="Buscar áreas"
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
