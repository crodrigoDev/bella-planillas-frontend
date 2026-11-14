import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { useReactivarDerechohabiente } from "../../hooks/useDerechohabienteActions";
import type { Derechohabiente } from "../../types/derechohabientes.types";

interface ReactivarDerechohabienteModalProps {
  derechohabiente: Derechohabiente;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para reactivar a un derechohabiente quitado
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se
 * descarta el error de un intento anterior.
 */
export function ReactivarDerechohabienteModal({
  derechohabiente,
  open,
  onOpenChange,
}: ReactivarDerechohabienteModalProps) {
  return (
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      <ReactivarDerechohabienteContent
        derechohabiente={derechohabiente}
        onClose={() => onOpenChange(false)}
      />
    </ConfirmModal>
  );
}

interface ReactivarDerechohabienteContentProps {
  derechohabiente: Derechohabiente;
  onClose: () => void;
}

function ReactivarDerechohabienteContent({
  derechohabiente,
  onClose,
}: ReactivarDerechohabienteContentProps) {
  const mutation = useReactivarDerechohabiente(derechohabiente.id);

  const handleConfirm = () => {
    mutation.mutate(undefined, { onSuccess: onClose });
  };

  return (
    <ConfirmModalBody
      title="Reactivar derechohabiente"
      description={
        <>
          {derechohabiente.nombres} {derechohabiente.apellidos} volverá a contar
          entre los derechohabientes activos del empleado.
        </>
      }
      confirmLabel="Reactivar"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
