import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useDescargarArchivoExportacion } from "../../hooks/useExportacionActions";
import type { ArchivoExportacion } from "../../types/exportaciones.types";
import { getArchivosColumns } from "./archivos.columns";

const MAX_ARCHIVOS_VISIBLES = 5;

interface ExportacionArchivosTablaProps {
  exportacionId: string;
  archivos: readonly ArchivoExportacion[];
}

/**
 * Muestra la lista de archivos generados con su botón de descarga
 *
 * @remarks
 * Si hay más de 5 archivos (por ejemplo, boletas masivas), la tabla inicia plegada.
 */
export function ExportacionArchivosTabla({
  exportacionId,
  archivos,
}: ExportacionArchivosTablaProps) {
  const [abierta, setAbierta] = useState(false);
  const descargar = useDescargarArchivoExportacion();

  const columns = getArchivosColumns({
    archivoEnDescarga: descargar.variables?.nombre,
    hayDescargaActiva: descargar.isPending,
    onDescargar: (nombre) => descargar.mutate({ id: exportacionId, nombre }),
  });

  const tabla = (
    <DataTable
      columns={columns}
      data={archivos}
      emptyMessage="No se registraron archivos en esta exportación"
    />
  );

  if (archivos.length <= MAX_ARCHIVOS_VISIBLES) {
    return tabla;
  }

  return (
    <Collapsible open={abierta} onOpenChange={setAbierta} className="space-y-3">
      <CollapsibleTrigger
        render={<Button type="button" variant="outline" size="sm" />}
      >
        {abierta ? "Ocultar archivos" : `Ver archivos (${archivos.length})`}
        {abierta ? (
          <ChevronUpIcon data-icon="inline-end" />
        ) : (
          <ChevronDownIcon data-icon="inline-end" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent>{tabla}</CollapsibleContent>
    </Collapsible>
  );
}
