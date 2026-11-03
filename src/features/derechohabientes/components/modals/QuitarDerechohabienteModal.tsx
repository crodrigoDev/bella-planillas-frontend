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
import { useDesactivarDerechohabiente } from "../../hooks/useDerechohabienteActions";
import type { Derechohabiente } from "../../types/derechohabientes.types";

interface QuitarDerechohabienteModalProps {
  derechohabiente: Derechohabiente;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para quitar a un derechohabiente
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se
 * descarta el error de un intento anterior.
 */
export function QuitarDerechohabienteModal({
  derechohabiente,
  open,
  onOpenChange,
}: QuitarDerechohabienteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <QuitarDerechohabienteContent
          derechohabiente={derechohabiente}
          onClose={() => onOpenChange(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface QuitarDerechohabienteContentProps {
  derechohabiente: Derechohabiente;
  onClose: () => void;
}

function QuitarDerechohabienteContent({
  derechohabiente,
  onClose,
}: QuitarDerechohabienteContentProps) {
  const mutation = useDesactivarDerechohabiente(derechohabiente.id);

  const handleConfirm = () => {
    mutation.mutate(undefined, { onSuccess: onClose });
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Quitar derechohabiente</AlertDialogTitle>
        <AlertDialogDescription>
          {derechohabiente.nombres} {derechohabiente.apellidos} dejará de verse
          en la lista. La asignación familiar del empleado no cambia sola:
          revísala si era el único hijo que la generaba.
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
          Quitar
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
