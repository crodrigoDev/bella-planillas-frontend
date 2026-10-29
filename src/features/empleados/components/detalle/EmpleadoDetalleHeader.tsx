import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmpleadoActions } from "../listado/EmpleadoActions";
import { EmpleadoEstadoBadge } from "../listado/EmpleadoEstadoBadge";
import type { Empleado } from "../../types/empleados.types";
import { getIniciales, getNombreCompleto } from "../../utils/empleados.utils";

interface EmpleadoDetalleHeaderProps {
  empleado: Empleado;
}

/**
 * Cabecera de la ficha: iniciales, nombre, cargo y área, estado y acciones
 */
export function EmpleadoDetalleHeader({ empleado }: EmpleadoDetalleHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* `cn` no resuelve conflictos de Tailwind: el `!` hace ganar al size-8 y text-sm base */}
        <Avatar className="size-14!">
          <AvatarFallback className="bg-primary/10 text-lg! font-medium text-primary">
            {getIniciales(empleado)}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 id="empleado-title" className="text-2xl font-semibold">
              {getNombreCompleto(empleado)}
            </h1>
            <EmpleadoEstadoBadge
              activo={empleado.activo}
              estadoLaboral={empleado.estado_laboral}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {empleado.cargo.nombre} · {empleado.area.nombre}
          </p>
        </div>
      </div>

      <EmpleadoActions empleado={empleado} showFicha={false} />
    </header>
  );
}
