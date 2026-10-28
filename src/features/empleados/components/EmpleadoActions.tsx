import { useState } from "react";
import {
  EllipsisVerticalIcon,
  IdCardIcon,
  PencilIcon,
  RefreshCwIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Empleado } from "../types/empleados.types";
import { getNombreCompleto } from "../utils/empleados.utils";
import { CambiarEstadoDialog } from "./CambiarEstadoDialog";
import { DarDeBajaDialog } from "./DarDeBajaDialog";
import { ReactivarDialog } from "./ReactivarDialog";

type EmpleadoDialog = "estado" | "baja" | "reactivar";

interface EmpleadoActionsProps {
  empleado: Empleado;
}

/**
 * Menú de acciones de una fila de empleados y los diálogos que abre
 *
 * @remarks
 * Un empleado activo puede cambiar de estado o darse de baja; uno inactivo
 * solo puede reactivarse, porque el backend rechaza las demás operaciones.
 * "Ver ficha" y "Editar" aparecen como en el diseño, pero siguen
 * deshabilitadas hasta que exista la rama de detalle y edición.
 */
export function EmpleadoActions({ empleado }: EmpleadoActionsProps) {
  const [openDialog, setOpenDialog] = useState<EmpleadoDialog | null>(null);

  const closeDialog = (open: boolean) => {
    if (!open) setOpenDialog(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Acciones de ${getNombreCompleto(empleado)}`}
            />
          }
        >
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            <IdCardIcon />
            Ver ficha
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <PencilIcon />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {empleado.activo ? (
            <>
              <DropdownMenuItem onClick={() => setOpenDialog("estado")}>
                <RefreshCwIcon />
                Cambiar estado
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenDialog("baja")}
              >
                <UserXIcon />
                Dar de baja
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => setOpenDialog("reactivar")}>
              <UserCheckIcon />
              Reactivar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CambiarEstadoDialog
        empleado={empleado}
        open={openDialog === "estado"}
        onOpenChange={closeDialog}
      />
      <DarDeBajaDialog
        empleado={empleado}
        open={openDialog === "baja"}
        onOpenChange={closeDialog}
      />
      <ReactivarDialog
        empleado={empleado}
        open={openDialog === "reactivar"}
        onOpenChange={closeDialog}
      />
    </>
  );
}
