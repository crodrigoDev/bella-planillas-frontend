import { useState } from "react";
import { Link } from "react-router-dom";
import { PencilIcon, RefreshCwIcon, UserCheckIcon, UserXIcon } from "lucide-react";

import { buildEditarEmpleadoPath } from "@/app/routes/path";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Empleado } from "../../types/empleados.types";
import {
  EmpleadoModales,
  type EmpleadoModal,
} from "../modals/EmpleadoModales";

interface EmpleadoDetalleAccionesProps {
  empleado: Empleado;
}

/**
 * Acciones de la cabecera de la ficha: editar, cambiar estado y dar de baja o reactivar
 *
 * @remarks
 * Un empleado activo puede cambiar de estado o darse de baja; uno inactivo
 * solo puede reactivarse, porque el backend rechaza las demás operaciones.
 * "Editar" abre la página de edición.
 */
export function EmpleadoDetalleAcciones({
  empleado,
}: EmpleadoDetalleAccionesProps) {
  const [openModal, setOpenModal] = useState<EmpleadoModal | null>(null);

  const closeModal = () => setOpenModal(null);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="lg"
        nativeButton={false}
        render={<Link to={buildEditarEmpleadoPath(empleado.id)} />}
      >
        <PencilIcon data-icon="inline-start" />
        Editar
      </Button>

      <Tooltip>
        {/* El span deja que el tooltip funcione aunque el botón esté deshabilitado */}
        <TooltipTrigger render={<span />}>
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Cambiar estado"
            disabled={!empleado.activo}
            onClick={() => setOpenModal("estado")}
          >
            <RefreshCwIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {empleado.activo
            ? "Cambiar estado"
            : "Solo se puede cambiar el estado de un empleado activo"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-lg"
              aria-label={empleado.activo ? "Dar de baja" : "Reactivar"}
              className={empleado.activo ? "text-destructive" : undefined}
              onClick={() => setOpenModal(empleado.activo ? "baja" : "reactivar")}
            />
          }
        >
          {empleado.activo ? <UserXIcon /> : <UserCheckIcon />}
        </TooltipTrigger>
        <TooltipContent>
          {empleado.activo ? "Dar de baja" : "Reactivar"}
        </TooltipContent>
      </Tooltip>

      <EmpleadoModales
        empleado={empleado}
        openModal={openModal}
        onClose={closeModal}
      />
    </div>
  );
}
