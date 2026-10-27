import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { createColumnHelper } from "@tanstack/react-table";
import type { Empleado } from "../types/empleados.types";
import { formatDate } from "@/lib/format.utils";
import { EmpleadoEstadoBadge } from "../components/EmpleadoEstadoBadge";
import { formatTurno } from "../utils/empleados.utils";

const columnHelper = createColumnHelper<DataTableFeatures, Empleado>();

/**
 * Columnas de la tabla de empleados
 */
export const empleadosColumns = columnHelper.columns([
  columnHelper.display({
    id: "colaborador",
    header: "Colaborador",
    cell: ({ row }) => {
      const { nombre, apellido, nro_documento, email } = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {nombre} {apellido}
          </span>
          <span className="text-xs text-muted-foreground">{nro_documento}</span>
          {email && (
            <span className="text-xs text-muted-foreground">{email}</span>
          )}
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
]);
