import { useState } from "react";
import { ArrowLeft, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/components/data-table/DataTable";
import type { ReporteImportacion } from "../../types/importar-empleados.types";
import { importacionErroresColumns, importacionFilasColumns } from "../../config/importacion.columns";
import { descargarErroresImportacion } from "../../utils/importar-empleados.utils";

interface ImportacionRevisionProps {
  report: ReporteImportacion;
  fileName?: string;
  onBack: () => void;
  onConfirm: () => void;
}

/** Presenta las filas validas y los errores antes de confirmar el trabajo */
export default function ImportacionRevision({ report, fileName, onBack, onConfirm }: ImportacionRevisionProps) {
  const [tab, setTab] = useState<"filas" | "errores">("filas");
  const invalidRows = new Set(report.errores_detalle.map((error) => error.fila)).size;
  const metrics = [
    { label: "Filas del archivo", value: report.total_filas },
    { label: "Filas válidas", value: report.filas_validas },
    { label: "Filas con errores", value: invalidRows },
    { label: "Errores encontrados", value: report.errores_detalle.length },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-1"><h3 className="text-sm font-semibold text-foreground">Revisa la validación</h3><p className="break-all text-xs text-muted-foreground">{fileName}</p></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => <Card key={metric.label} className="shadow-none ring-border"><CardContent><p className="text-xs text-muted-foreground">{metric.label}</p><p className="mt-2 text-2xl font-semibold">{metric.value}</p></CardContent></Card>)}
      </div>
      <p className="text-xs text-muted-foreground">Una fila puede tener varios errores. Solo las filas válidas se enviarán al procesamiento.</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Vista de la validación" className="flex gap-2">
          <Button size="sm" variant={tab === "filas" ? "default" : "outline"} aria-pressed={tab === "filas"} onClick={() => setTab("filas")}>Filas válidas ({report.filas_validas})</Button>
          <Button size="sm" variant={tab === "errores" ? "default" : "outline"} aria-pressed={tab === "errores"} onClick={() => setTab("errores")}>Errores ({report.errores_detalle.length})</Button>
        </div>
        {report.errores_detalle.length > 0 && <Button variant="outline" size="sm" onClick={() => descargarErroresImportacion(report.errores_detalle)}><Download aria-hidden="true" /> Descargar errores</Button>}
      </div>
      {tab === "filas" ? (
        <DataTable columns={importacionFilasColumns} data={report.filas_validas_data} caption="Filas válidas para importar" className="min-w-220" emptyState="No hay filas válidas para importar" />
      ) : (
        <DataTable columns={importacionErroresColumns} data={report.errores_detalle} caption="Errores encontrados en el archivo" className="min-w-180" emptyState="No se encontraron errores de validación" />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background p-4">
        <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft aria-hidden="true" /> Cambiar archivo</Button>
        <Button size="sm" disabled={!report.filas_validas} onClick={onConfirm}><Check aria-hidden="true" /> Importar {report.filas_validas} filas válidas</Button>
      </div>
    </div>
  );
}
