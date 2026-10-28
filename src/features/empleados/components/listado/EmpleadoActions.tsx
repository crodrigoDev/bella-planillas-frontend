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
import type { Empleado } from "../../types/empleados.types";
import { getNombreCompleto } from "../../utils/empleados.utils";
import { CambiarEstadoModal } from "../modals/CambiarEstadoModal";
import { DarDeBajaModal } from "../modals/DarDeBajaModal";
import { ReactivarModal } from "../modals/ReactivarModal";

type EmpleadoModal = "estado" | "baja" | "reactivar";

interface EmpleadoActionsProps {
  empleado: Empleado;
}

/**
 * Menú de acciones de una fila de empleados y los modales que abre
 *
 * @remarks
 * Un empleado activo puede cambiar de estado o darse de baja; uno inactivo
 * solo puede reactivarse, porque el backend rechaza las demás operaciones.
 * "Ver ficha" y "Editar" aparecen como en el diseño, pero siguen
 * deshabilitadas hasta que exista la rama de detalle y edición.
 */
export function EmpleadoActions({ empleado }: EmpleadoActionsProps) {
  const [openModal, setOpenModal] = useState<EmpleadoModal | null>(null);

  const closeModal = (open: boolean) => {
    if (!open) setOpenModal(null);
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
              <DropdownMenuItem onClick={() => setOpenModal("estado")}>
                <RefreshCwIcon />
                Cambiar estado
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenModal("baja")}
              >
                <UserXIcon />
                Dar de baja
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => setOpenModal("reactivar")}>
              <UserCheckIcon />
              Reactivar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CambiarEstadoModal
        empleado={empleado}
        open={openModal === "estado"}
        onOpenChange={closeModal}
      />
      <DarDeBajaModal
        empleado={empleado}
        open={openModal === "baja"}
        onOpenChange={closeModal}
      />
      <ReactivarModal
        empleado={empleado}
        open={openModal === "reactivar"}
        onOpenChange={closeModal}
      />
    </>
  );
}
