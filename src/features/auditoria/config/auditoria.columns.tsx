import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { buildSolicitudPath } from "@/app/routes/path";
import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { AccionButton } from "@/components/page/AccionButton";
import { formatFechaHoraLima } from "@/lib/date.utils";
import type { AuditoriaLog } from "../types/auditoria.types";
import { getUsuarioNombre, shortId } from "../utils/auditoria.utils";
import {
  getAccionLabel,
  getAccionTone,
  getTablaLabel,
  TABLA_SOLICITUD,
} from "./auditoria.config";

const columnHelper = createColumnHelper<DataTableFeatures, AuditoriaLog>();

/**
 * Columnas de la tabla de auditoría
 *
 * @param handlers.onVerCambios - Se llama con la fila cuyo botón "Ver cambios" se pulsó
 * @param handlers.onFiltrarUsuario - Se llama con el id y el correo del usuario de la fila
 */
export const getAuditoriaColumns = ({
  onVerCambios,
  onFiltrarUsuario,
}: {
  onVerCambios: (log: AuditoriaLog) => void;
  onFiltrarUsuario: (usuarioId: string, email: string) => void;
}) =>
  columnHelper.columns([
    columnHelper.display({
      id: "fecha",
      header: "Fecha y hora",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatFechaHoraLima(row.original.created_at)}
        </span>
      ),
    }),
    columnHelper.display({
      id: "usuario",
      header: "Usuario",
      cell: ({ row }) => {
        const log = row.original;

        // Sin usuario la acción la hizo el sistema: no hay a quién filtrar
        if (!log.usuarios || !log.usuario_id)
          return <span className="text-muted-foreground">Sistema</span>;

        const { usuario_id } = log;
        const { email, rol } = log.usuarios;

        return (
          <button
            type="button"
            title="Filtrar por este usuario"
            className="flex min-w-0 max-w-64 flex-col text-left hover:underline"
            onClick={() => onFiltrarUsuario(usuario_id, email)}
          >
            <span className="font-medium">{getUsuarioNombre(log)}</span>
            <span className="truncate text-xs text-muted-foreground">
              {email} · {rol}
            </span>
          </button>
        );
      },
    }),
    columnHelper.display({
      id: "accion",
      header: "Acción",
      cell: ({ row }) => (
        <StatusBadge tone={getAccionTone(row.original.accion)}>
          {getAccionLabel(row.original.accion)}
        </StatusBadge>
      ),
    }),
    columnHelper.display({
      id: "modulo",
      header: "Módulo",
      cell: ({ row }) => getTablaLabel(row.original.tabla_afectada),
    }),
    columnHelper.display({
      id: "registro",
      header: "Registro",
      cell: ({ row }) => {
        const { tabla_afectada, registro_id } = row.original;
        const id = (
          <span className="font-mono text-xs" title={registro_id}>
            {shortId(registro_id)}
          </span>
        );

        return tabla_afectada === TABLA_SOLICITUD ? (
          <Link
            to={buildSolicitudPath(registro_id)}
            className="text-primary hover:underline"
          >
            {id}
          </Link>
        ) : (
          id
        );
      },
    }),
    columnHelper.display({
      id: "ip",
      header: "IP",
      cell: ({ row }) => row.original.direccion_ip,
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <AccionButton
          label="Ver cambios"
          icon={EyeIcon}
          onClick={() => onVerCambios(row.original)}
        />
      ),
    }),
  ]);
