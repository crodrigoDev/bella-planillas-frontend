import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  PencilIcon,
  RefreshCwIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";

import {
  buildEditarDatosFinancierosPath,
  buildEditarEmpleadoPath,
} from "@/app/routes/path";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDatosFinancierosEmpleado } from "@/features/datosFinancieros/hooks/useDatosFinancieros";
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
 * "Editar" es un acceso directo a la edición del empleado mientras no tenga
 * datos financieros; cuando los tiene, es un menú con las dos ediciones.
 */
export function EmpleadoDetalleAcciones({
  empleado,
}: EmpleadoDetalleAccionesProps) {
  const [openModal, setOpenModal] = useState<EmpleadoModal | null>(null);

  const closeModal = () => setOpenModal(null);

  // Mientras carga o si no hay datos, "Editar" va directo a los datos personales
  const { data: datosFinancieros } = useDatosFinancierosEmpleado(empleado.id);

  return (
    <div className="flex items-center gap-2">
      {datosFinancieros ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="lg" />}>
            <PencilIcon data-icon="inline-start" />
            Editar
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={<Link to={buildEditarEmpleadoPath(empleado.id)} />}
            >
              Personal y laboral
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link to={buildEditarDatosFinancierosPath(empleado.id)} />
              }
            >
              Financiero
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={<Link to={buildEditarEmpleadoPath(empleado.id)} />}
        >
          <PencilIcon data-icon="inline-start" />
          Editar
        </Button>
      )}

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
