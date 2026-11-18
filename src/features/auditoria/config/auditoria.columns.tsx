import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon, FileTextIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
  buildAuditoriaDetallePath,
  buildSolicitudPath,
} from "@/app/routes/path";
import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { orDash } from "@/lib/format.utils";
import type {
  DetalleLocationState,
  FilaActividad,
  TipoAfectadoAuditoria,
} from "../types/auditoria.types";
import { AfectadoCelda } from "../components/listado/AfectadoCelda";
import { getAccionTone, MODULO_SOLICITUD } from "./auditoria.config";

/** Aspecto de los botones de icono que son enlaces (mismo que `AccionButton`) */
const ACCION_ENLACE =
  "border-muted-foreground/30 text-muted-foreground hover:text-foreground";

const columnHelper = createColumnHelper<DataTableFeatures, FilaActividad>();

/**
 * Columnas de la tabla de auditoría
 *
 * @param handlers.volverA - Ruta del listado con sus filtros; viaja con el enlace al detalle para poder volver
 * @param handlers.onFiltrarUsuario - Se llama con el id y el nombre de quien hizo la acción
 * @param handlers.onFiltrarAfectado - Se llama con el tipo, el id y el nombre del afectado
 */
export const getAuditoriaColumns = ({
  volverA,
  onFiltrarUsuario,
  onFiltrarAfectado,
}: {
  volverA: string;
  onFiltrarUsuario: (usuarioId: string, nombre: string) => void;
  onFiltrarAfectado: (
    tipo: TipoAfectadoAuditoria,
    id: string,
    nombre: string,
  ) => void;
}) =>
  columnHelper.columns([
    columnHelper.display({
      id: "fecha",
      header: "Fecha y hora",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatFechaHoraLima(row.original.fecha)}
        </span>
      ),
    }),
    columnHelper.display({
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <StatusBadge tone={getAccionTone(row.original.accion_etiqueta)}>
          {row.original.accion_etiqueta}
        </StatusBadge>
      ),
    }),
    columnHelper.display({
      id: "modulo",
      header: "Módulo",
      cell: ({ row }) => row.original.modulo_etiqueta,
    }),
    columnHelper.display({
      id: "afectado",
      header: "Afectado",
      cell: ({ row }) => {
        const { afectado } = row.original;

        if (!afectado) return orDash(undefined);

        return (
          <AfectadoCelda afectado={afectado} onFiltrar={onFiltrarAfectado} />
        );
      },
    }),
    columnHelper.display({
      id: "resumen",
      header: "Qué pasó",
      cell: ({ row }) => (
        <p className="min-w-64 max-w-md whitespace-normal">
          {row.original.resumen}
        </p>
      ),
    }),
    columnHelper.display({
      id: "actor",
      header: "Hecho por",
      cell: ({ row }) => {
        const { actor } = row.original;

        // Sin usuario la acción la hizo el sistema: no hay a quién filtrar
        if (!actor)
          return <span className="text-muted-foreground">Sistema</span>;

        return (
          <button
            type="button"
            title="Filtrar por este usuario"
            className="flex min-w-0 max-w-56 flex-col text-left hover:underline"
            onClick={() => onFiltrarUsuario(actor.id, actor.nombre)}
          >
            <span className="font-medium">{actor.nombre}</span>
            <span className="truncate text-xs text-muted-foreground">
              {actor.rol}
            </span>
          </button>
        );
      },
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            aria-label="Ver detalle"
            title="Ver detalle"
            className={ACCION_ENLACE}
            render={
              <Link
                to={buildAuditoriaDetallePath(row.original.id)}
                state={{ volverA } satisfies DetalleLocationState}
              />
            }
          >
            <EyeIcon />
          </Button>
          {/* Solo las solicitudes tienen pantalla de detalle */}
          {row.original.modulo === MODULO_SOLICITUD && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Ver la solicitud"
              title="Ver la solicitud"
              className={ACCION_ENLACE}
              render={<Link to={buildSolicitudPath(row.original.registro_id)} />}
            >
              <FileTextIcon />
            </Button>
          )}
        </div>
      ),
    }),
  ]);
