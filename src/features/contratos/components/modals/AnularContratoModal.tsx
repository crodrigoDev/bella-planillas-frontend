import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
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
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      <AnularContratoContent
        contrato={contrato}
        onClose={() => onOpenChange(false)}
      />
    </ConfirmModal>
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
    <ConfirmModalBody
      title="Anular contrato"
      description={
        <>
          Se anulará el contrato que empieza el{" "}
          {formatDate(contrato.fecha_inicio)} y dejará de verse en la lista.
          Esta acción no se puede deshacer desde el sistema.
        </>
      }
      confirmLabel="Anular"
      variant="destructive"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
