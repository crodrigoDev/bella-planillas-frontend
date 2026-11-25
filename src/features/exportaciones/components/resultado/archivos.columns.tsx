import { createColumnHelper } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";

import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { LoadingButton } from "@/components/form/LoadingButton";
import { formatBytes } from "@/lib/archivo.utils";
import type { ArchivoExportacion } from "../../types/exportaciones.types";
import { getTipoArchivoLabel } from "../../utils/exportaciones.utils";

const columnHelper = createColumnHelper<
  DataTableFeatures,
  ArchivoExportacion
>();

interface ArchivosColumnsOptions {
  archivoEnDescarga?: string;
  hayDescargaActiva: boolean;
  onDescargar: (nombre: string) => void;
}

/**
 * Columnas de la tabla de archivos generados por una exportación
 */
export const getArchivosColumns = ({
  archivoEnDescarga,
  hayDescargaActiva,
  onDescargar,
}: ArchivosColumnsOptions) =>
  columnHelper.columns([
    columnHelper.display({
      id: "nombre",
      header: "Archivo",
      cell: ({ row }) => (
        <span className="font-medium break-all">{row.original.nombre}</span>
      ),
    }),
    columnHelper.display({
      id: "tipo",
      header: "Tipo",
      cell: ({ row }) => getTipoArchivoLabel(row.original.tipo),
    }),
    columnHelper.display({
      id: "bytes",
      header: "Tamaño",
      cell: ({ row }) => (
        <span className="tabular-nums">{formatBytes(row.original.bytes)}</span>
      ),
    }),
    columnHelper.display({
      id: "acciones",
      header: "Descargar",
      cell: ({ row }) => {
        const nombre = row.original.nombre;
        const descargandoEste =
          hayDescargaActiva && archivoEnDescarga === nombre;

        return (
          <LoadingButton
            type="button"
            variant="outline"
            size="sm"
            icon={DownloadIcon}
            isLoading={descargandoEste}
            disabled={hayDescargaActiva}
            loadingText="Descargando…"
            onClick={() => onDescargar(nombre)}
          >
            Descargar
          </LoadingButton>
        );
      },
    }),
  ]);
