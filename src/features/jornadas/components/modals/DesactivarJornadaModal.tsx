import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { useDesactivarJornada } from "../../hooks/useJornadaActions";
import type { Jornada } from "../../types/jornadas.types";

interface DesactivarJornadaModalProps {
  /** Jornada a desactivar; es null mientras el modal está cerrado */
  jornada: Jornada | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para desactivar una jornada
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se descarta
 * el error de un intento anterior. Desactivar es definitivo desde la app.
 */
export function DesactivarJornadaModal({
  jornada,
  open,
  onOpenChange,
}: DesactivarJornadaModalProps) {
  return (
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      {jornada && (
        <DesactivarJornadaContent
          jornada={jornada}
          onClose={() => onOpenChange(false)}
        />
      )}
    </ConfirmModal>
  );
}

interface DesactivarJornadaContentProps {
  jornada: Jornada;
  onClose: () => void;
}

function DesactivarJornadaContent({
  jornada,
  onClose,
}: DesactivarJornadaContentProps) {
  const mutation = useDesactivarJornada();

  const handleConfirm = () => {
    mutation.mutate(jornada, { onSuccess: onClose });
  };

  return (
    <ConfirmModalBody
      title={`Desactivar ${jornada.nombre}`}
      description="La jornada dejará de aparecer en el listado y no se podrá asignar a nadie. Esta acción no se puede deshacer desde la aplicación."
      confirmLabel="Desactivar"
      variant="destructive"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
