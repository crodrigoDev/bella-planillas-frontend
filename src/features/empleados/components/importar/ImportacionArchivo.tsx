import { useRef } from "react";
import { Download, FileSpreadsheet, Upload, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IMPORTACION_COLUMNAS, IMPORTACION_ESCENARIOS } from "../../config/importar-empleados.config";
import type { EscenarioImportacion } from "../../types/importar-empleados.types";

interface ImportacionArchivoProps {
  file: File | null;
  scenario: EscenarioImportacion;
  onFile: (file: File) => void;
  onScenario: (scenario: EscenarioImportacion) => void;
  onExample: () => void;
  onValidate: () => void;
}

/** Permite descargar la plantilla y elegir el archivo de la importacion */
export default function ImportacionArchivo({ file, scenario, onFile, onScenario, onExample, onValidate }: ImportacionArchivoProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      <Card className="shadow-none ring-border">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">1. Prepara el archivo</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Usa las {IMPORTACION_COLUMNAS.length} columnas de la plantilla</p>
          </div>
          <Button variant="outline" size="sm" render={<a href={`${import.meta.env.BASE_URL}mocks/plantilla_carga_masiva_empleados.xlsx`} download="plantilla_carga_masiva_empleados.xlsx" />}>
            <Download aria-hidden="true" /> Descargar plantilla Excel
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-muted-foreground">
          <p>La carga masiva necesita documento, sexo, nacimiento, domicilio, fecha de ingreso, área y cargo. Los catálogos del archivo se escriben por nombre.</p>
          <p>Un documento ya registrado actualiza al empleado existente. Esta importación guarda datos personales y financieros; los contratos se gestionan aparte.</p>
          <details className="rounded-lg border p-3">
            <summary className="cursor-pointer font-medium text-foreground">Ver columnas de la plantilla</summary>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {IMPORTACION_COLUMNAS.map((column) => <li key={column} className="break-all">{column}</li>)}
            </ul>
          </details>
        </CardContent>
      </Card>
      <Card className="shadow-none ring-border">
        <CardHeader><h3 className="text-sm font-semibold">2. Selecciona el archivo</h3></CardHeader>
        <CardContent className="space-y-5">
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const dropped = event.dataTransfer.files[0];
              if (dropped) onFile(dropped);
            }}
            className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed bg-muted/20 px-4 py-8 text-center"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/7 text-primary"><Upload aria-hidden="true" className="size-6" /></span>
            <p className="text-sm font-medium">Arrastra tu archivo aquí</p>
            <p className="text-xs text-muted-foreground">Excel (.xlsx) o CSV (.csv), hasta 50 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.csv"
              aria-label="Archivo de empleados"
              tabIndex={-1}
              className="sr-only"
              onChange={(event) => {
                const chosen = event.currentTarget.files?.[0];
                if (chosen) onFile(chosen);
                event.currentTarget.value = "";
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>Seleccionar archivo</Button>
          </div>
          {file && (
            <div role="status" className="flex min-w-0 items-center gap-3 rounded-lg border p-3">
              <FileSpreadsheet aria-hidden="true" className="size-5 shrink-0 text-primary" />
              <div className="min-w-0 text-xs">
                <p className="truncate font-medium" title={file.name}>{file.name}</p>
                <p className="mt-1 text-muted-foreground">{file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`}</p>
              </div>
            </div>
          )}
          <div className="grid gap-3 rounded-lg bg-primary/4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="min-w-0 space-y-2">
              <label htmlFor="importacion-escenario" className="text-xs font-medium">Escenario de prueba</label>
              <Select items={IMPORTACION_ESCENARIOS} value={scenario} onValueChange={(value) => {
                const option = IMPORTACION_ESCENARIOS.find((item) => item.value === value);
                if (option) onScenario(option.value);
              }}>
                <SelectTrigger id="importacion-escenario" className="w-full bg-background text-xs"><SelectValue /></SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>{IMPORTACION_ESCENARIOS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="w-fit" onClick={onExample}><WandSparkles aria-hidden="true" /> Usar archivo de ejemplo</Button>
            <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">Durante esta prueba se valida un conjunto de datos de ejemplo, no el contenido del archivo seleccionado</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end"><Button onClick={onValidate} disabled={!file}>Validar archivo</Button></div>
    </div>
  );
}
