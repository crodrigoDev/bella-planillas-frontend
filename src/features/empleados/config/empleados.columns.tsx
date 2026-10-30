import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { buildEmpleadoPath } from "@/app/routes/path";
import type { Empleado } from "../types/empleados.types";
import { formatDate } from "@/lib/format.utils";
import { EmpleadoEstadoBadge } from "../components/listado/EmpleadoEstadoBadge";
import { EmpleadoActions } from "../components/listado/EmpleadoActions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  formatTurno,
  getIniciales,
  getNombreCompleto,
} from "../utils/empleados.utils";

const columnHelper = createColumnHelper<DataTableFeatures, Empleado>();

/**
 * Columnas de la tabla de empleados
 */
export const empleadosColumns = columnHelper.columns([
  columnHelper.display({
    id: "colaborador",
    header: "Colaborador",
    cell: ({ row }) => {
      const { nro_documento, email } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
              {getIniciales(row.original)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col">
            <Link
              to={buildEmpleadoPath(row.original.id)}
              className="font-medium hover:underline"
            >
              {getNombreCompleto(row.original)}
            </Link>
            <span className="truncate text-xs text-muted-foreground">
              {email ? `${nro_documento} · ${email}` : nro_documento}
            </span>
          </div>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "areaCargo",
    header: "Área y cargo",
    cell: ({ row }) => {
      const { area, cargo } = row.original;

      return (
        <div className="flex flex-col">
          <span>{area.nombre}</span>
          <span className="text-xs text-muted-foreground">{cargo.nombre}</span>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "jornadaTurno",
    header: "Jornada y turno",
    cell: ({ row }) => {
      const { jornada } = row.original;

      if (!jornada)
        return <span className="text-muted-foreground">Sin jornada</span>;

      return (
        <div className="flex flex-col">
          <span>{jornada.nombre}</span>
          <span className="text-xs text-muted-foreground">
            {formatTurno(jornada.turno)}
          </span>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <EmpleadoEstadoBadge
        activo={row.original.activo}
        estadoLaboral={row.original.estado_laboral}
      />
    ),
  }),
  columnHelper.display({
    id: "fechaInicio",
    header: "Fecha inicio",
    cell: ({ row }) => formatDate(row.original.fecha_inicio),
  }),
  columnHelper.display({
    id: "fechaCese",
    header: "Fecha cese",
    cell: ({ row }) =>
      row.original.fecha_cese ? (
        formatDate(row.original.fecha_cese)
      ) : (
        <span className="text-muted-foreground">Sin fecha</span>
      ),
  }),
  columnHelper.display({
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => <EmpleadoActions empleado={row.original} />,
  }),
]);
