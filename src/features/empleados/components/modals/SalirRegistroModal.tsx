import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";

interface SalirRegistroModalProps {
  open: boolean;
  /** Se queda en el registro */
  onStay: () => void;
  /** Sale del registro */
  onLeave: () => void;
}

/**
 * Confirmación al salir del registro cuando el empleado ya se creó a medias
 */
export function SalirRegistroModal({
  open,
  onStay,
  onLeave,
}: SalirRegistroModalProps) {
  return (
    <ConfirmModal
      open={open}
      onOpenChange={(next) => {
        if (!next) onStay();
      }}
    >
      <ConfirmModalBody
        title="¿Salir del registro?"
        description="El empleado ya se creó, pero faltan datos por guardar. Si sales ahora, su registro quedará incompleto en el sistema y se perderá lo que escribiste."
        cancelLabel="Seguir aquí"
        confirmLabel="Salir de todos modos"
        variant="destructive"
        onConfirm={onLeave}
      />
    </ConfirmModal>
  );
}
