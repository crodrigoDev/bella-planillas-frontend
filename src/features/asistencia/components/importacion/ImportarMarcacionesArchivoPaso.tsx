import { useState } from "react";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FileDropzone } from "@/components/form/FileDropzone";
import { LoadingButton } from "@/components/form/LoadingButton";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  MARCACIONES_COLUMNAS,
  MARCACIONES_EXTENSION,
  MARCACIONES_MAX_BYTES,
  MARCACIONES_MAX_FILAS,
} from "../../config/marcaciones.config";
import { useValidarMarcaciones } from "../../hooks/useImportarMarcaciones";
import type { ImportacionMarcacionesValidacion } from "../../types/marcaciones.types";

interface ImportarMarcacionesArchivoPasoProps {
  /** Se llama con el archivo y el resultado de revisarlo */
  onValidado: (
    archivo: File,
    revision: ImportacionMarcacionesValidacion,
  ) => void;
}

// Mismas reglas que el backend, para avisar antes de enviar
const getArchivoError = (file: File | null): string | null => {
  if (!file) return null;

  if (!file.name.toLowerCase().endsWith(MARCACIONES_EXTENSION))
    return "El archivo debe ser de Excel (.xlsx).";
  if (file.size > MARCACIONES_MAX_BYTES)
    return "El archivo no puede superar los 2 MB.";

  return null;
};

/**
 * Paso 1: explicar el formato, elegir el Excel y revisarlo
 *
 * @remarks
 * Revisar no guarda nada: solo dice si el archivo se puede importar.
 */
export function ImportarMarcacionesArchivoPaso({
  onValidado,
}: ImportarMarcacionesArchivoPasoProps) {
  const [file, setFile] = useState<File | null>(null);
  const validar = useValidarMarcaciones();

  const archivoError = getArchivoError(file);

  const handleChange = (next: File | null) => {
    validar.reset();
    setFile(next);
  };

  const handleValidar = () => {
    if (!file || archivoError) return;

    validar.mutate(file, {
      onSuccess: (revision) => onValidado(file, revision),
    });
  };

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div className="space-y-3">
        <div>
          <h2 className="font-medium">1. Prepara el archivo</h2>
          <p className="text-sm text-muted-foreground">
            Un Excel (.xlsx) con una marcación por fila y estas columnas, con
            estos nombres exactos en la primera fila:
          </p>
        </div>

        <ul className="list-disc space-y-1 pl-5 text-sm">
          {MARCACIONES_COLUMNAS.map(({ nombre, detalle }) => (
            <li key={nombre}>
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                {nombre}
              </code>
              : {detalle}
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground">
          Máximo {MARCACIONES_MAX_FILAS} filas y 2 MB. Todas las marcaciones
          deben ser de un solo mes.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="importar-marcaciones-archivo">
          2. Sube el archivo
        </FieldLabel>
        <FileDropzone
          id="importar-marcaciones-archivo"
          file={file}
          onChange={handleChange}
          accept={MARCACIONES_EXTENSION}
          hint="Archivos .xlsx de hasta 2 MB"
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
