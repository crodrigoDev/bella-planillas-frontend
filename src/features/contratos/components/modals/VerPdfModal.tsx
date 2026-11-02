import { useEffect } from "react";
import { DownloadIcon } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useContratoPdf } from "../../hooks/useContratos";
import type { Contrato } from "../../types/contratos.types";

interface VerPdfModalProps {
  contrato: Contrato;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal que muestra el PDF firmado de un contrato y permite descargarlo
 *
 * @remarks
 * El PDF se pide solo cuando el modal se abre: el contenido se monta al
 * abrir y se desmonta al cerrar.
 */
export function VerPdfModal({
  contrato,
  open,
  onOpenChange,
}: VerPdfModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-4xl">
        <VerPdfContent contratoId={contrato.id} />
      </DialogContent>
    </Dialog>
  );
}

function VerPdfContent({ contratoId }: { contratoId: string }) {
  const { data: url, error } = useContratoPdf(contratoId);

  // Libera la URL temporal cuando el visor se cierra o llega otra
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Contrato firmado</DialogTitle>
        <DialogDescription>PDF adjunto al contrato.</DialogDescription>
      </DialogHeader>

      <ErrorAlert error={error} />

      {url ? (
        <iframe
          src={url}
          title="PDF del contrato"
          className="h-[70vh] w-full rounded-md border"
        />
      ) : (
        !error && <Skeleton className="h-[70vh] w-full" />
      )}

      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>
          Cerrar
        </DialogClose>
        {url && (
          <Button
            render={<a href={url} download="contrato.pdf" />}
            nativeButton={false}
          >
            <DownloadIcon data-icon="inline-start" />
            Descargar
          </Button>
        )}
      </DialogFooter>
    </>
  );
}
