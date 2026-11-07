import { createColumnHelper } from "@tanstack/react-table";
import { BanIcon, CheckIcon, EyeIcon, HandIcon, XIcon } from "lucide-react";

import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import { AccionButton } from "@/components/page/AccionButton";
import { formatDate, orDash } from "@/lib/format.utils";
import { cn } from "@/lib/utils";
import type { AccionSolicitud, Solicitud } from "../types/solicitudes.types";
import {
  estaAbierta,
  formatPeriodoSolicitud,
  getAccionesSolicitud,
  getTonoFechaLimite,
} from "../utils/solicitudes.utils";
import { getEstadoLabel, getEstadoTone, getTipoLabel } from "./solicitudes.config";

const columnHelper = createColumnHelper<DataTableFeatures, Solicitud>();

/**
 * Columnas de la tabla de solicitudes
 *
 * @param handlers.onVerDetalle - Se llama con la fila cuyo botón "Ver detalle" se pulsó
 * @param handlers.onAccion - Se llama con la fila y la acción rápida pulsada
 * @param handlers.userId - Id del usuario de la sesión, para saber si es el responsable
 *
 * @remarks
 * Las acciones rápidas solo salen en solicitudes abiertas: pendiente (tomar y
 * anular) o en revisión (aprobar, rechazar y anular). Con veredicto solo queda
 * "Ver detalle". Aprobar y rechazar quedan deshabilitados, con su motivo, si
 * el usuario no es el responsable.
 */
export const getSolicitudesColumns = ({
  onVerDetalle,
  onAccion,
  userId,
}: {
  onVerDetalle: (solicitud: Solicitud) => void;
  onAccion: (solicitud: Solicitud, accion: AccionSolicitud) => void;
  userId: string | undefined;
}) =>
  columnHelper.columns([
    columnHelper.display({
      id: "codigo",
      header: "Código",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.codigo}</span>
      ),
    }),
    columnHelper.display({
      id: "colaborador",
      header: "Colaborador",
      cell: ({ row }) => {
        const { colaborador } = row.original;

        return (
          <div className="flex min-w-0 max-w-64 flex-col">
            <span className="truncate font-medium">
              {colaborador.nombre_completo}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {colaborador.area.nombre}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "tipo",
      header: "Tipo",
      cell: ({ row }) => getTipoLabel(row.original.tipo),
    }),
    columnHelper.display({
      id: "periodo",
      header: "Periodo o monto",
      cell: ({ row }) => formatPeriodoSolicitud(row.original),
    }),
    columnHelper.display({
      id: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <StatusBadge tone={getEstadoTone(row.original.estado)} withDot>
          {getEstadoLabel(row.original.estado)}
        </StatusBadge>
      ),
    }),
    columnHelper.display({
      id: "responsable",
      header: "Responsable",
      cell: ({ row }) => orDash(row.original.responsable?.nombre_completo),
    }),
    columnHelper.display({
      id: "fecha_limite",
      header: "Fecha límite",
      cell: ({ row }) => {
        const tono = getTonoFechaLimite(row.original);

        return (
          <span className={cn(tono && ["font-medium", TONE_TEXT[tono]])}>
            {formatDate(row.original.fecha_limite)}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const solicitud = row.original;
        const abierta = estaAbierta(solicitud.estado);
        const acciones = getAccionesSolicitud(solicitud, userId);
        const pendiente = solicitud.estado === "PENDIENTE";

        return (
          <div className="flex gap-1.5">
            <AccionButton
              label="Ver detalle"
              icon={EyeIcon}
              onClick={() => onVerDetalle(solicitud)}
            />
            {pendiente && (
              <AccionButton
                label="Tomar"
                icon={HandIcon}
                tone="info"
                onClick={() => onAccion(solicitud, "tomar")}
                disabledReason={acciones.tomar ?? undefined}
              />
            )}
            {abierta && !pendiente && (
              <>
                <AccionButton
                  label="Aprobar"
                  icon={CheckIcon}
                  tone="success"
                  onClick={() => onAccion(solicitud, "aprobar")}
                  disabledReason={acciones.aprobar ?? undefined}
                />
                <AccionButton
                  label="Rechazar"
                  icon={XIcon}
                  tone="danger"
                  onClick={() => onAccion(solicitud, "rechazar")}
                  disabledReason={acciones.rechazar ?? undefined}
                />
              </>
            )}
            {abierta && (
              <AccionButton
                label="Anular"
                icon={BanIcon}
                tone="danger"
                onClick={() => onAccion(solicitud, "anular")}
                disabledReason={acciones.anular ?? undefined}
              />
            )}
          </div>
        );
      },
    }),
  ]);
