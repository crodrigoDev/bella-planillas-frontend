import { useState, type FormEvent } from "react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FileDropzone } from "@/components/form/FileDropzone";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { getArchivoError, type ReglasArchivo } from "@/lib/archivo.utils";
import { PDF_MAX_BYTES } from "../../config/contratos.config";
import { useSubirContratoPdf } from "../../hooks/useContratoActions";
import type { Contrato } from "../../types/contratos.types";

interface SubirPdfModalProps {
  contrato: Contrato;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para adjuntar el PDF firmado de un contrato
 *
 * @remarks
 * El formulario está dentro del contenido: al cerrarse se desmonta y el
 * archivo elegido se descarta. Una vez adjuntado, el contrato ya no se
 * puede editar ni cambiar el PDF.
 */
export function SubirPdfModal({
  contrato,
  open,
  onOpenChange,
}: SubirPdfModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <SubirPdfForm
          contrato={contrato}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface SubirPdfFormProps {
  contrato: Contrato;
  onClose: () => void;
}

// Mismas reglas que el backend, para avisar antes de enviar
const REGLAS_ARCHIVO: ReglasArchivo = {
  tipos: ["application/pdf"],
  maxBytes: PDF_MAX_BYTES,
  descripcionTipo: "un PDF",
  nombre: "El PDF",
};

function SubirPdfForm({ contrato, onClose }: SubirPdfFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const mutation = useSubirContratoPdf(contrato.id);

  const archivoError = getArchivoError(file, REGLAS_ARCHIVO);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || archivoError) return;

    mutation.mutate(file, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Adjuntar PDF</DialogTitle>
        <DialogDescription>
          Sube el contrato firmado. Al adjuntarlo, el contrato ya no se podrá
          editar y el PDF no se podrá reemplazar.
        </DialogDescription>
      </DialogHeader>

      <Field>
        <FieldLabel htmlFor="contrato-pdf">Archivo PDF</FieldLabel>
        <FileDropzone
          id="contrato-pdf"
          file={file}
          onChange={setFile}
          accept="application/pdf"
          hint="Únicamente archivos PDF"
          invalid={Boolean(archivoError)}
          disabled={mutation.isPending}
        />
        {archivoError && <FieldError>{archivoError}</FieldError>}
      </Field>

      <ErrorAlert error={mutation.error} />

      <ModalFormFooter
        isPending={mutation.isPending}
        submitLabel="Adjuntar"
        loadingText="Subiendo…"
        disabled={!file || Boolean(archivoError)}
      />
    </form>
  );
}
