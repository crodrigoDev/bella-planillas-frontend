import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { useDesactivarCargo } from "../../hooks/useCargoActions";
import type { CargoResumenDto } from "../../types/cargos.types";

interface DesactivarCargoModalProps {
  /** Cargo a desactivar; es null mientras el modal está cerrado */
  cargo: CargoResumenDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para desactivar un cargo
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se descarta
 * el error de un intento anterior. Desactivar es definitivo desde la app.
 */
export function DesactivarCargoModal({
  cargo,
  open,
  onOpenChange,
}: DesactivarCargoModalProps) {
  return (
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      {cargo && (
        <DesactivarCargoContent
          cargo={cargo}
          onClose={() => onOpenChange(false)}
        />
      )}
    </ConfirmModal>
  );
}

interface DesactivarCargoContentProps {
  cargo: CargoResumenDto;
  onClose: () => void;
}

function DesactivarCargoContent({
  cargo,
  onClose,
}: DesactivarCargoContentProps) {
  const mutation = useDesactivarCargo();

  const handleConfirm = () => {
    mutation.mutate(cargo, { onSuccess: onClose });
  };

  return (
    <ConfirmModalBody
      title={`Desactivar ${cargo.nombre}`}
      description="El cargo dejará de aparecer en el listado y no se podrá asignar a nuevos colaboradores. Esta acción no se puede deshacer desde la aplicación."
      confirmLabel="Desactivar"
      variant="destructive"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
