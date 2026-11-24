import { createColumnHelper } from "@tanstack/react-table";
import { BanIcon, CheckIcon, XIcon, type LucideIcon } from "lucide-react";

import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import type { StatusTone } from "@/components/feedback/statusTone.config";
import { AccionButton } from "@/components/page/AccionButton";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { formatCurrency } from "@/lib/format.utils";
import { EstadoNovedadBadge } from "../components/EstadoNovedadBadge";
import {
  getNaturalezaNovedad,
  TIPO_NOVEDAD_LABELS,
} from "../config/novedades.config";
import type { AccionNovedad, NovedadPlanilla } from "../types/novedades.types";
import { getAccionesNovedad } from "../utils/novedades.utils";

const columnHelper = createColumnHelper<DataTableFeatures, NovedadPlanilla>();

const ACCION_META: Record<
  AccionNovedad,
  { label: string; icon: LucideIcon; tone: StatusTone }
> = {
  APROBADO: { label: "Aprobar", icon: CheckIcon, tone: "success" },
  RECHAZADO: { label: "Rechazar", icon: XIcon, tone: "danger" },
  ANULADO: { label: "Anular", icon: BanIcon, tone: "danger" },
};

/** Opciones para armar las columnas de la tabla de novedades */
export interface NovedadesColumnsOptions {
  novedades: readonly NovedadPlanilla[];
  editable: boolean;
  onResolver: (novedad: NovedadPlanilla, accion: AccionNovedad) => void;
}

/**
 * Columnas de la tabla de novedades de un colaborador en un mes
 */
export const getNovedadesColumns = ({
  novedades,
  editable,
  onResolver,
}: NovedadesColumnsOptions) => {
  const baseColumns = [
    columnHelper.display({
      id: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const novedad = row.original;

        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {TIPO_NOVEDAD_LABELS[novedad.tipo]}
            </span>
            <span className="text-xs text-muted-foreground">
              {getNaturalezaNovedad(novedad.tipo)}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "monto",
      header: () => <div className="text-right">Monto</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium tabular-nums">
          {formatCurrency(Number(row.original.monto))}
        </div>
      ),
    }),
    columnHelper.display({
      id: "motivo",
      header: "Motivo y sustento",
      cell: ({ row }) => {
        const novedad = row.original;

        return (
          <div className="min-w-56 max-w-sm space-y-0.5 whitespace-normal break-words">
            <p>{novedad.motivo}</p>
            <p className="text-xs text-muted-foreground">
              Sustento: {novedad.referencia_evidencia}
            </p>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const novedad = row.original;

        return (
          <div className="max-w-xs space-y-1 whitespace-normal break-words">
            <EstadoNovedadBadge estado={novedad.estado} />
            {novedad.motivo_resolucion && (
              <p className="text-xs text-muted-foreground">
                {novedad.motivo_resolucion}
              </p>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "registrada",
      header: "Registrada",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatFechaHoraLima(row.original.created_at)}
        </span>
      ),
    }),
  ];

  if (!editable) {
    return columnHelper.columns(baseColumns);
  }

  return columnHelper.columns([
    ...baseColumns,
    columnHelper.display({
      id: "acciones",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const novedad = row.original;
        const acciones = getAccionesNovedad(novedad, novedades);

        if (acciones.length === 0) return null;

        return (
          <div className="flex justify-end gap-1.5">
            {acciones.map((item) => {
              const meta = ACCION_META[item.accion];

              return (
                <AccionButton
                  key={item.accion}
                  label={meta.label}
                  icon={meta.icon}
                  tone={meta.tone}
                  onClick={() => onResolver(novedad, item.accion)}
                  disabledReason={item.disponible ? undefined : item.motivo}
                />
              );
            })}
          </div>
        );
      },
    }),
  ]);
};
