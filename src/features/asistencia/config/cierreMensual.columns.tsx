import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { buildEmpleadoPath } from "@/app/routes/path";
import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { CheckIcon } from "lucide-react";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { AccionButton } from "@/components/page/AccionButton";
import type { Incidencia } from "../types/incidencias.types";
import {
  formatMinutos,
  getMotivoNoAprobable,
} from "../utils/asistencia.utils";
import { ESTADO_RESUMEN } from "./asistencia.config";

const columnHelper = createColumnHelper<DataTableFeatures, Incidencia>();

/** Horas extra (texto decimal del backend) para mostrar, sin ceros de sobra */
const formatHoras = (horas: string): string => `${Number(horas)} h`;

/**
 * Columnas de la tabla del cierre mensual
 *
 * @param onAprobar - Se llama con la fila cuyo botón "Aprobar" se pulsó
 */
export const getCierreMensualColumns = (
  onAprobar: (incidencia: Incidencia) => void,
) =>
  columnHelper.columns([
    columnHelper.display({
      id: "colaborador",
      header: "Colaborador",
      cell: ({ row }) => {
        const { empleado_id, colaborador, nro_documento, periodo } =
          row.original;

        return (
          <div className="flex min-w-0 flex-col">
            <Link
              to={`${buildEmpleadoPath(empleado_id, "asistencia")}?periodo=${periodo}`}
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
    columnHelper.accessor("area", { header: "Área" }),
    columnHelper.accessor("dias_trabajados", { header: "Días trabajados" }),
    columnHelper.accessor("faltas", { header: "Faltas" }),
    columnHelper.display({
      id: "tardanza",
      header: "Tardanza",
      cell: ({ row }) => formatMinutos(row.original.minutos_tardanza),
    }),
    columnHelper.display({
      id: "extras25",
      header: "Extras 25 %",
      cell: ({ row }) => formatHoras(row.original.horas_extras_25),
    }),
    columnHelper.display({
      id: "extras35",
      header: "Extras 35 %",
      cell: ({ row }) => formatHoras(row.original.horas_extras_35),
    }),
    columnHelper.accessor("pendientes", { header: "Pendientes" }),
    columnHelper.display({
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const { estado, vigente, completo } = row.original;
        const { label, tone } = ESTADO_RESUMEN[estado];

        return (
          <div className="flex flex-wrap gap-1">
            <StatusBadge tone={tone}>{label}</StatusBadge>
            {estado === "PENDIENTE" && !vigente && (
              <StatusBadge tone="warning">Desactualizado</StatusBadge>
            )}
            {estado === "PENDIENTE" && !completo && (
              <StatusBadge tone="neutral">Incompleto</StatusBadge>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      // Solo los pendientes se aprueban; si falta algo, el tooltip dice qué
      cell: ({ row }) =>
        row.original.estado === "PENDIENTE" && (
          <AccionButton
            label="Aprobar"
            icon={CheckIcon}
            tone="success"
            onClick={() => onAprobar(row.original)}
            disabledReason={getMotivoNoAprobable(row.original) ?? undefined}
          />
        ),
    }),
  ]);
