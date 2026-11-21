import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { buildEmpleadoPath } from "@/app/routes/path";
import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { CheckIcon, RotateCcwIcon, XIcon } from "lucide-react";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { AccionButton } from "@/components/page/AccionButton";
import type { Incidencia } from "../types/incidencias.types";
import { formatMinutos } from "../utils/asistencia.utils";
import { ESTADO_RESUMEN } from "./asistencia.config";

const columnHelper = createColumnHelper<DataTableFeatures, Incidencia>();

/** Horas extra (texto decimal del backend) para mostrar, sin ceros de sobra */
const formatHoras = (horas: string): string => `${Number(horas)} h`;

/** Acciones que se abren desde la columna "Acciones" de una fila */
export interface CierreMensualAcciones {
  /** Resumen pendiente: se aprueba el mes de la fila */
  onAprobar: (incidencia: Incidencia) => void;
  /** Resumen pendiente: se rechaza el mes de la fila */
  onRechazar: (incidencia: Incidencia) => void;
  /** Resumen aprobado o rechazado: se vuelve a dejar pendiente */
  onReabrir: (incidencia: Incidencia) => void;
}

/**
 * Columnas de la tabla del cierre mensual
 *
 * @param acciones - Qué hacer con la fila cuando se pulsa Aprobar, Rechazar o Reabrir
 */
export const getCierreMensualColumns = ({
  onAprobar,
  onRechazar,
  onReabrir,
}: CierreMensualAcciones) =>
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
      // Los pendientes se aprueban o rechazan; los que ya tienen veredicto se reabren.
      // Si una acción no se puede hacer, su tooltip trae el motivo que da el backend.
      cell: ({ row }) => {
        const { estado, acciones } = row.original;
        const pendiente = estado === "PENDIENTE";

        return (
          <div className="flex gap-1">
            {pendiente && (
              <>
                <AccionButton
                  label="Aprobar"
                  icon={CheckIcon}
                  tone="success"
                  onClick={() => onAprobar(row.original)}
                  disabledReason={acciones.aprobar ?? undefined}
                />
                <AccionButton
                  label="Rechazar"
                  icon={XIcon}
                  tone="danger"
                  onClick={() => onRechazar(row.original)}
                  disabledReason={acciones.rechazar ?? undefined}
                />
              </>
            )}
            {!pendiente && (
              <AccionButton
                label="Reabrir"
                icon={RotateCcwIcon}
                tone="info"
                onClick={() => onReabrir(row.original)}
                disabledReason={acciones.reabrir ?? undefined}
              />
            )}
          </div>
        );
      },
    }),
  ]);
