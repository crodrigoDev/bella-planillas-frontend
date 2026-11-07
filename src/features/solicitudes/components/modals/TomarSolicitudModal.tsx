import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { useTomarSolicitud } from "../../hooks/useSolicitudActions";

interface TomarSolicitudModalProps {
  /** Solicitud a tomar */
  solicitud: { id: string; codigo: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para tomar una solicitud y revisarla
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se descarta el
 * error de un intento anterior. Tomarla es definitivo: no se puede soltar ni
 * reasignar, y solo quien la toma puede aprobarla o rechazarla.
 */
export function TomarSolicitudModal({
  solicitud,
  open,
  onOpenChange,
}: TomarSolicitudModalProps) {
  return (
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      <TomarSolicitudContent
        solicitud={solicitud}
        onClose={() => onOpenChange(false)}
      />
    </ConfirmModal>
  );
}

interface TomarSolicitudContentProps {
  solicitud: { id: string; codigo: string };
  onClose: () => void;
}

function TomarSolicitudContent({
  solicitud,
  onClose,
}: TomarSolicitudContentProps) {
  const mutation = useTomarSolicitud(solicitud.id, solicitud.codigo);

  const handleConfirm = () => {
    mutation.mutate(undefined, { onSuccess: onClose });
  };

  return (
    <ConfirmModalBody
      title={`Tomar la solicitud ${solicitud.codigo}`}
      description={
        <>
          Quedarás como responsable de la revisión y pasará a «En revisión».
          Solo tú podrás aprobarla o rechazarla, y no se puede soltar ni
          reasignar a otra persona.
        </>
      }
      confirmLabel="Tomar solicitud"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
