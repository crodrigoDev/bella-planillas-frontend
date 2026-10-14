import {
  EllipsisVertical,
  Pencil,
  RefreshCw,
  UserRoundCheck,
  UserRoundMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EmpleadoListado } from "../types/empleados.types";
import { getEmpleadoNombre } from "../utils/empleados.utils";

interface EmpleadoRowActionsProps {
  empleado: EmpleadoListado;
}

/** Muestra las acciones disponibles para un registro activo o inactivo */
export default function EmpleadoRowActions({
  empleado,
}: EmpleadoRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Acciones de ${getEmpleadoNombre(empleado)}`}
            className="text-slate-400 hover:text-primary"
          />
        }
      >
        <EllipsisVertical aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {empleado.activo ? (
          <>
            <DropdownMenuItem disabled>
              <Pencil aria-hidden="true" /> Editar empleado
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <RefreshCw aria-hidden="true" /> Cambiar estado laboral
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" disabled>
              <UserRoundMinus aria-hidden="true" /> Dar de baja
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled>
            <UserRoundCheck aria-hidden="true" /> Reactivar empleado
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
