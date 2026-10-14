import {
  EllipsisVertical,
  Pencil,
  RefreshCw,
  UserRoundCheck,
  UserRoundMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePath, Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EmpleadoActions, EmpleadoListado } from "../types/empleados.types";
import { getEmpleadoNombre } from "../utils/empleados.utils";

interface EmpleadoRowActionsProps extends EmpleadoActions {
  empleado: EmpleadoListado;
}

/** Muestra las acciones disponibles para un registro activo o inactivo */
export default function EmpleadoRowActions({
  empleado,
  onChangeState,
  onDeactivate,
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
            <DropdownMenuItem render={<Link to={generatePath(ROUTE_PATHS.gestionPersonal.editarEmpleado, { empleadoId: empleado.id })} />}>
              <Pencil aria-hidden="true" /> Editar empleado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeState(empleado)}>
              <RefreshCw aria-hidden="true" /> Cambiar estado laboral
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDeactivate(empleado)}>
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
