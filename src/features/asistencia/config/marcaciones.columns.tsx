import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { buildEmpleadoPath } from "@/app/routes/path";
import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import type {
  ImportacionMarcacionesError,
  Marcacion,
} from "../types/marcaciones.types";
import { formatFechaLima, formatHoraLima } from "../utils/marcaciones.utils";
import { TIPO_MARCA_LABELS } from "./asistencia.config";
import { getMetodoMarcacion } from "./marcaciones.config";

const columnHelper = createColumnHelper<DataTableFeatures, Marcacion>();
const errorHelper = createColumnHelper<
  DataTableFeatures,
  ImportacionMarcacionesError
>();

/** Columnas de la tabla de marcaciones */
export const marcacionesColumns = columnHelper.columns([
  columnHelper.display({
    id: "colaborador",
    header: "Colaborador",
    cell: ({ row }) => {
      const { empleado_id, colaborador, nro_documento } = row.original;

      return (
        <div className="flex min-w-0 flex-col">
          <Link
            to={buildEmpleadoPath(empleado_id, "asistencia")}
            className="font-medium hover:underline"
          >
            {colaborador}
          </Link>
          <span className="truncate text-xs text-muted-foreground">
            {nro_documento}
          </span>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "fecha",
    header: "Fecha",
    cell: ({ row }) => formatFechaLima(row.original.fecha_hora),
  }),
  columnHelper.display({
    id: "hora",
    header: "Hora",
    cell: ({ row }) => formatHoraLima(row.original.fecha_hora),
  }),
  columnHelper.display({
    id: "tipo",
    header: "Tipo",
    cell: ({ row }) =>
      TIPO_MARCA_LABELS[row.original.tipo_marcacion] ??
      row.original.tipo_marcacion,
  }),
  columnHelper.display({
    id: "metodo",
    header: "Método",
    cell: ({ row }) => {
      const { label, tone } = getMetodoMarcacion(row.original.metodo);

      return <StatusBadge tone={tone}>{label}</StatusBadge>;
    },
  }),
]);

/** Columnas de los errores por fila de la revisión del Excel */
export const erroresImportacionColumns = errorHelper.columns([
  errorHelper.accessor("fila", { header: "Fila" }),
  errorHelper.accessor("detalle", { header: "Detalle" }),
]);
