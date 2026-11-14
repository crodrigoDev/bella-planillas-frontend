import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
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
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      <QuitarDerechohabienteContent
        derechohabiente={derechohabiente}
        onClose={() => onOpenChange(false)}
      />
    </ConfirmModal>
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
    <ConfirmModalBody
      title="Quitar derechohabiente"
      description={
        <>
          {derechohabiente.nombres} {derechohabiente.apellidos} dejará de contar
          entre los derechohabientes activos. Puedes deshacerlo desde el aviso
          que aparece al quitarlo. La asignación familiar del empleado no
          cambia sola: revísala si era el único hijo que la generaba.
        </>
      }
      confirmLabel="Quitar"
      variant="destructive"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
