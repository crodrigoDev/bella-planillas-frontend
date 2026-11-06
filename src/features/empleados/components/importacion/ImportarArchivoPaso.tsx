import { useState } from "react";
import { DownloadIcon } from "lucide-react";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FileDropzone } from "@/components/form/FileDropzone";
import { LoadingButton } from "@/components/form/LoadingButton";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { formatBytes, getArchivoError, type ReglasArchivo } from "@/lib/archivo.utils";
import {
  CARGA_MASIVA_EXTENSIONES,
  CARGA_MASIVA_MAX_BYTES,
} from "../../config/cargaMasiva.config";
import {
  useDescargarPlantilla,
  useValidarCargaMasiva,
} from "../../hooks/useCargaMasiva";
import type { CargaMasivaPreValidacion } from "../../types/cargaMasiva.types";

interface ImportarArchivoPasoProps {
  /** Se llama con el resultado de revisar el archivo */
  onValidado: (revision: CargaMasivaPreValidacion) => void;
}

// Mismas reglas que el backend, para avisar antes de enviar
const REGLAS_ARCHIVO: ReglasArchivo = {
  extensiones: CARGA_MASIVA_EXTENSIONES.split(","),
  maxBytes: CARGA_MASIVA_MAX_BYTES,
  descripcionTipo: "de Excel (.xlsx) o CSV (.csv)",
};

/**
 * Paso 1: descargar la plantilla, elegir el archivo y revisarlo
 *
 * @remarks
 * Revisar no guarda nada: solo muestra qué filas se podrían importar.
 */
export function ImportarArchivoPaso({ onValidado }: ImportarArchivoPasoProps) {
  const [file, setFile] = useState<File | null>(null);
  const plantilla = useDescargarPlantilla();
  const validar = useValidarCargaMasiva();

  const archivoError = getArchivoError(file, REGLAS_ARCHIVO);

  const handleChange = (next: File | null) => {
    validar.reset();
    setFile(next);
  };

  const handleValidar = () => {
    if (!file || archivoError) return;

    validar.mutate(file, { onSuccess: onValidado });
  };

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-medium">1. Descarga la plantilla</h2>
          <p className="text-sm text-muted-foreground">
            Llénala con un empleado por fila y guárdala como Excel o CSV.
          </p>
        </div>

        <LoadingButton
          type="button"
          variant="outline"
          isLoading={plantilla.isPending}
          loadingText="Descargando…"
          icon={DownloadIcon}
          onClick={() => plantilla.mutate()}
        >
          Descargar plantilla
        </LoadingButton>
      </div>

      <Field>
        <FieldLabel htmlFor="importar-archivo">2. Sube el archivo</FieldLabel>
        <FileDropzone
          id="importar-archivo"
          file={file}
          onChange={handleChange}
          accept={CARGA_MASIVA_EXTENSIONES}
          hint={`Archivos .xlsx o .csv de hasta ${formatBytes(CARGA_MASIVA_MAX_BYTES)}`}
          invalid={Boolean(archivoError)}
          disabled={validar.isPending}
        />
        {archivoError && <FieldError>{archivoError}</FieldError>}
      </Field>

      <ErrorAlert error={validar.error} title="No se pudo revisar el archivo" />

      <div className="flex justify-end">
        <LoadingButton
          type="button"
          isLoading={validar.isPending}
          loadingText="Validando…"
          disabled={!file || Boolean(archivoError)}
          onClick={handleValidar}
        >
          Validar archivo
        </LoadingButton>
      </div>
    </div>
  );
}
