import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { buildPlanillaPath } from "@/app/routes/path";
import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { AccionButton } from "@/components/page/AccionButton";
import { formatCurrency, toTitleCase } from "@/lib/format.utils";
import { EstadoPlanillaBadge } from "../components/EstadoPlanillaBadge";
import type { PlanillaResumen } from "../types/planillas.types";

const columnHelper = createColumnHelper<DataTableFeatures, PlanillaResumen>();

/** Nombre completo formateado para pasar al detalle en el estado de navegación */
export const getNombrePlanilla = ({ empleados }: PlanillaResumen): string =>
  toTitleCase(`${empleados.nombre} ${empleados.apellido}`);

const formatApellidoNombre = ({ empleados }: PlanillaResumen): string =>
  `${toTitleCase(empleados.apellido)}, ${toTitleCase(empleados.nombre)}`;

/**
 * Columnas de la tabla mensual de planillas
 *
 * @param handlers.onVerDetalle - Se llama al pulsar la acción "Ver detalle" de una fila
 */
export const getPlanillasColumns = ({
  onVerDetalle,
}: {
  onVerDetalle: (planilla: PlanillaResumen) => void;
}) =>
  columnHelper.columns([
    columnHelper.display({
      id: "colaborador",
      header: "Colaborador",
      cell: ({ row }) => {
        const planilla = row.original;

        return (
          <Link
            to={buildPlanillaPath(planilla.id)}
            state={{ nombre: getNombrePlanilla(planilla) }}
            className="font-medium hover:underline"
          >
            {formatApellidoNombre(planilla)}
          </Link>
        );
      },
    }),
    columnHelper.display({
      id: "estado",
      header: "Estado",
      cell: ({ row }) => <EstadoPlanillaBadge estado={row.original.estado} />,
    }),
    columnHelper.display({
      id: "sueldo_base",
      header: () => <div className="text-right">Sueldo básico</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">
          {formatCurrency(Number(row.original.sueldo_base))}
        </div>
      ),
    }),
    columnHelper.display({
      id: "total_ingresos",
      header: () => <div className="text-right">Ingresos</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">
          {formatCurrency(Number(row.original.total_ingresos))}
        </div>
      ),
    }),
    columnHelper.display({
      id: "total_descuentos",
      header: () => <div className="text-right">Descuentos</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">
          {formatCurrency(Number(row.original.total_descuentos))}
        </div>
      ),
    }),
    columnHelper.display({
      id: "neto_a_pagar",
      header: () => <div className="text-right">Neto a pagar</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold tabular-nums">
          {formatCurrency(Number(row.original.neto_a_pagar))}
        </div>
      ),
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <AccionButton
          label="Ver detalle"
          icon={EyeIcon}
          onClick={() => onVerDetalle(row.original)}
        />
      ),
    }),
  ]);
