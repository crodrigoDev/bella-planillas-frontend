import { Ban, MoreVertical, Pencil } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AreaViewModel } from "@/features/areas/types/areas.types";

/** Datos y acciones del menú de un área. */
interface AreaActionsProps {
  /** Área correspondiente a la fila. */
  area: AreaViewModel;
  /** Abre el formulario de edición. */
  onEdit: (area: AreaViewModel) => void;
  /** Solicita revisar la desactivación. */
  onDeactivate: (area: AreaViewModel) => void;
}

/** Muestra las acciones de edición y desactivación de un área. */
export function AreaActions({
  area,
  onEdit,
  onDeactivate,
}: AreaActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Acciones de ${area.nombre}`}
        className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreVertical aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onEdit(area)}>
          <Pencil aria-hidden="true" className="size-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          disabled={!area.isActive}
          onClick={() => onDeactivate(area)}
        >
          <Ban aria-hidden="true" className="size-4" />
          Desactivar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}