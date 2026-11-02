import { useState, type ChangeEvent, type FormEvent } from "react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
const getArchivoError = (file: File | null): string | null => {
  if (!file) return null;
  if (file.type !== "application/pdf")
    return "El archivo debe ser un PDF.";
  if (file.size > PDF_MAX_BYTES) return "El PDF no puede superar los 5 MB.";

  return null;
};

function SubirPdfForm({ contrato, onClose }: SubirPdfFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const mutation = useSubirContratoPdf(contrato.id);

  const archivoError = getArchivoError(file);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

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
        <Input
          id="contrato-pdf"
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          aria-invalid={Boolean(archivoError)}
          disabled={mutation.isPending}
        />
        {archivoError && <FieldError>{archivoError}</FieldError>}
      </Field>

      <ErrorAlert error={mutation.error} />

      <DialogFooter>
        <DialogClose
          render={<Button type="button" variant="outline" />}
          disabled={mutation.isPending}
        >
          Cancelar
        </DialogClose>
        <LoadingButton
          type="submit"
          isLoading={mutation.isPending}
          loadingText="Subiendo…"
          disabled={!file || Boolean(archivoError)}
        >
          Adjuntar
        </LoadingButton>
      </DialogFooter>
    </form>
  );
}
