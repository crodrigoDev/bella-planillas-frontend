import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FilterChipProps {
  /** Texto del filtro aplicado, por ejemplo "Área: Operaciones" */
  label: string;
  onRemove: () => void;
}

/**
 * Etiqueta de un filtro aplicado, con un botón para quitarlo
 */
export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex h-7 items-center gap-0.5 rounded-md border bg-background pl-2.5 text-sm">
      {label}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Quitar el filtro ${label}`}
        onClick={onRemove}
      >
        <XIcon />
      </Button>
    </span>
  );
}
