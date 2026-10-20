import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { createColumnHelper } from "@tanstack/react-table";
import type { Empleado } from "../types/empleados.types";
import { formatCurrency, formatDate } from "@/lib/format.utils";
import { EmpleadoEstadoBadge } from "../components/EmpleadoEstadoBadge";

const columnHelper = createColumnHelper<DataTableFeatures, Empleado>();

/**
 * Columna de la tabla de empleados
 */
export const empleadosColumns = columnHelper.columns([
  columnHelper.display({
    id: "empleado",
    header: "Empleado",
    cell: ({ row }) => {
      const { apellido, nombre, email } = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {apellido}, {nombre}
          </span>
          {email && (
            <span className="text-xs text-muted-foreground">{email}</span>
          )}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "documento",
    header: "Documento",
    cell: ({ row }) => row.original.nro_documento,
  }),

  columnHelper.display({
    id: "areaCargo",
    header: "Área / Cargo",
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
    id: "jornada",
    header: "Jornada",
    cell: ({ row }) => {
      const { jornada } = row.original;

      if (!jornada)
        return <span className="text-muted-foreground">Sin jornada</span>;

      return (
        <div className="flex flex-col">
          <span>{jornada.nombre}</span>
          <span className="text-xs text-muted-foreground">{jornada.turno}</span>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "fechaInicio",
    header: "Inicio",
    cell: ({ row }) => formatDate(row.original.fecha_inicio),
  }),
  columnHelper.display({
    id: "sueldo",
    header: "Sueldo básico",
    cell: ({ row }) =>
      formatCurrency(row.original.dato_financiero?.sueldo_basico),
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
]);
