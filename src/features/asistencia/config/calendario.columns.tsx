import { createColumnHelper } from "@tanstack/react-table";
import { LockIcon, PencilIcon, PowerIcon, PowerOffIcon } from "lucide-react";

import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { AccionButton } from "@/components/page/AccionButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { orDash } from "@/lib/format.utils";
import type { DiaCalendarioAsistencia } from "../types/calendario.types";
import { formatFechaCompleta, formatPeriodo } from "../utils/asistencia.utils";
import { ORIGEN_DIA } from "./calendario.config";

const columnHelper = createColumnHelper<
  DataTableFeatures,
  DiaCalendarioAsistencia
>();

/** Motivo por el que no se puede cambiar un día de un mes cerrado */
const MOTIVO_MES_CERRADO =
  "El mes está cerrado. Reabre sus resúmenes para cambiarlo.";

/**
 * Columnas de la tabla del calendario
 *
 * @param onEditar - Se llama con el día acordado cuyo botón "Editar" se pulsó
 * @param onCambiarEstado - Se llama con el día acordado que se activa o desactiva
 */
export const getCalendarioColumns = (
  onEditar: (dia: DiaCalendarioAsistencia) => void,
  onCambiarEstado: (dia: DiaCalendarioAsistencia) => void,
) =>
  columnHelper.columns([
    columnHelper.display({
      id: "fecha",
      header: "Fecha",
      cell: ({ row }) => formatFechaCompleta(row.original.fecha),
    }),
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.display({
      id: "origen",
      header: "Origen",
      cell: ({ row }) => {
        const { label, tone } = ORIGEN_DIA[row.original.origen];

        return <StatusBadge tone={tone}>{label}</StatusBadge>;
      },
    }),
    columnHelper.display({
      id: "estado",
      header: "Estado",
      cell: ({ row }) =>
        row.original.activo ? (
          <StatusBadge tone="success">Activo</StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Inactivo</StatusBadge>
        ),
    }),
    columnHelper.display({
      id: "mes",
      header: "Mes",
      cell: ({ row }) => {
        const { fecha, periodo_cerrado } = row.original;

        return (
          <div className="flex items-center gap-1.5">
            <span>{formatPeriodo(fecha.slice(0, 7))}</span>
            {periodo_cerrado && (
              <StatusBadge tone="warning">
                <LockIcon className="size-3" aria-hidden />
                Cerrado
              </StatusBadge>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "motivo",
      header: "Motivo",
      cell: ({ row }) => {
        const motivo = row.original.motivo;

        if (!motivo) return orDash(motivo);

        return (
          <Tooltip>
            <TooltipTrigger
              render={<span className="block max-w-56 truncate" />}
            >
              {motivo}
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">{motivo}</TooltipContent>
          </Tooltip>
        );
      },
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      // Los feriados nacionales los calcula el motor: no se editan
      cell: ({ row }) => {
        const dia = row.original;

        if (dia.origen !== "ADICIONAL") return null;

        const bloqueado = dia.periodo_cerrado
          ? MOTIVO_MES_CERRADO
          : undefined;

        return (
          <div className="flex gap-1.5">
            <AccionButton
              label="Editar"
              icon={PencilIcon}
              onClick={() => onEditar(dia)}
              disabledReason={bloqueado}
            />
            <AccionButton
              label={dia.activo ? "Desactivar" : "Activar"}
              icon={dia.activo ? PowerOffIcon : PowerIcon}
              tone={dia.activo ? "danger" : "success"}
              onClick={() => onCambiarEstado(dia)}
              disabledReason={bloqueado}
            />
          </div>
        );
      },
    }),
  ]);
