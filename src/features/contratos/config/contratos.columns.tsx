import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";

import { buildEmpleadoPath } from "@/app/routes/path";
import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { formatDate } from "@/lib/format.utils";
import { ContratoProrroga } from "../components/ContratoProrroga";
import { ContratoVencimiento } from "../components/ContratoVencimiento";
import { ContratoAcciones } from "../components/listado/ContratoAcciones";
import { ContratoModalidadCelda } from "../components/listado/ContratoModalidadCelda";
import type { ContratoGlobal } from "../types/contratos.types";
import { getVencimientoContrato } from "../utils/contratos.utils";
import { ESTADO_CONTRATO } from "./contratos.config";

const columnHelper = createColumnHelper<DataTableFeatures, ContratoGlobal>();

/** Columnas de la tabla del listado global de contratos */
export const contratosColumns = columnHelper.columns([
  columnHelper.display({
    id: "colaborador",
    header: "Colaborador",
    cell: ({ row }) => {
      const { empleado_id, colaborador, nro_documento } = row.original;

      return (
        <div className="flex min-w-0 flex-col">
          <Link
            to={buildEmpleadoPath(empleado_id, "contratos")}
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
    id: "areaCargo",
    header: "Área y cargo",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.area}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.cargo}
        </span>
      </div>
    ),
  }),
  columnHelper.display({
    id: "modalidad",
    header: "Modalidad",
    cell: ({ row }) => (
      <ContratoModalidadCelda modalidad={row.original.tipo_modalidad} />
    ),
  }),
  columnHelper.display({
    id: "inicio",
    header: "Inicio",
    cell: ({ row }) => formatDate(row.original.fecha_inicio),
  }),
  columnHelper.display({
    id: "fin",
    header: "Fin",
    cell: ({ row }) =>
      row.original.fecha_fin ? (
        formatDate(row.original.fecha_fin)
      ) : (
        <span className="text-muted-foreground">Indeterminado</span>
      ),
  }),
  columnHelper.display({
    id: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = ESTADO_CONTRATO[row.original.estado];

      return (
        <div className="flex flex-col items-start gap-1">
          <StatusBadge tone={estado.tone}>{estado.label}</StatusBadge>
          {row.original.es_prorroga && <ContratoProrroga className="text-xs" />}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "vencimiento",
    header: "Vencimiento",
    cell: ({ row }) => {
      const vencimiento = getVencimientoContrato(row.original);

      return vencimiento ? (
        <ContratoVencimiento vencimiento={vencimiento} />
      ) : (
        <span className="text-muted-foreground">--</span>
      );
    },
  }),
  columnHelper.display({
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => <ContratoAcciones contrato={row.original} />,
  }),
]);
