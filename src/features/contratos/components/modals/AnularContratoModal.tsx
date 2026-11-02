import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/format.utils";
import { useAnularContrato } from "../../hooks/useContratoActions";
import type { Contrato } from "../../types/contratos.types";

interface AnularContratoModalProps {
  contrato: Contrato;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para anular un contrato
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se
 * descarta el error de un intento anterior.
 */
export function AnularContratoModal({
  contrato,
  open,
  onOpenChange,
}: AnularContratoModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AnularContratoContent
          contrato={contrato}
          onClose={() => onOpenChange(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface AnularContratoContentProps {
  contrato: Contrato;
  onClose: () => void;
}

function AnularContratoContent({
  contrato,
  onClose,
}: AnularContratoContentProps) {
  const mutation = useAnularContrato(contrato.id);

  const handleConfirm = () => {
    mutation.mutate(undefined, { onSuccess: onClose });
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Anular contrato</AlertDialogTitle>
        <AlertDialogDescription>
          Se anulará el contrato que empieza el{" "}
          {formatDate(contrato.fecha_inicio)} y dejará de verse en la lista.
          Esta acción no se puede deshacer desde el sistema.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <ErrorAlert error={mutation.error} />

      <AlertDialogFooter>
        <AlertDialogCancel disabled={mutation.isPending}>
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={handleConfirm}
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Spinner data-icon="inline-start" />}
          Anular
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
