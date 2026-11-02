import { useState, type ChangeEvent, type DragEvent } from "react";
import { CloudUploadIcon, FileTextIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  id: string;
  /** Archivo elegido; null si todavía no hay ninguno */
  file: File | null;
  onChange: (file: File | null) => void;
  /** Tipos que acepta el selector, por ejemplo "application/pdf" */
  accept?: string;
  /** Texto pequeño debajo de la invitación, por ejemplo "Únicamente archivos PDF" */
  hint?: string;
  invalid?: boolean;
  disabled?: boolean;
}

/**
 * Zona para elegir un archivo con un clic o arrastrándolo
 *
 * @remarks
 * Solo guarda el archivo elegido; validar su tipo o tamaño le toca a quien
 * la usa. El campo de archivo real queda oculto pero accesible con teclado.
 */
export function FileDropzone({
  id,
  file,
  onChange,
  accept,
  hint,
  invalid = false,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (!disabled) onChange(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <label
      htmlFor={id}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
        "hover:bg-muted/50 has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        isDragging && "border-ring bg-muted/50",
        invalid && "border-destructive",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />

      {file ? (
        <>
          <FileTextIcon className="size-8 text-muted-foreground" aria-hidden />
          <p className="max-w-full truncate text-sm font-medium">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Haz clic o arrastra otro archivo para cambiarlo
          </p>
        </>
      ) : (
        <>
          <CloudUploadIcon
            className="size-8 text-muted-foreground"
            aria-hidden
          />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">
              Haz clic para buscar
            </span>{" "}
            o arrastra el archivo aquí
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </>
      )}
    </label>
  );
}
