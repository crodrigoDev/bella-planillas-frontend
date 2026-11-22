import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { useDesactivarArea } from "../../hooks/useAreaActions";
import type { AreaResumenDto } from "../../types/areas.types";

interface DesactivarAreaModalProps {
  /** Área a desactivar; es null mientras el modal está cerrado */
  area: AreaResumenDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para desactivar un área
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se descarta
 * el error de un intento anterior. Desactivar es definitivo desde la app.
 */
export function DesactivarAreaModal({
  area,
  open,
  onOpenChange,
}: DesactivarAreaModalProps) {
  return (
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      {area && (
        <DesactivarAreaContent
          area={area}
          onClose={() => onOpenChange(false)}
        />
      )}
    </ConfirmModal>
  );
}

interface DesactivarAreaContentProps {
  area: AreaResumenDto;
  onClose: () => void;
}

function DesactivarAreaContent({
  area,
  onClose,
}: DesactivarAreaContentProps) {
  const mutation = useDesactivarArea();

  const handleConfirm = () => {
    mutation.mutate(area, { onSuccess: onClose });
  };

  return (
    <ConfirmModalBody
      title={`Desactivar ${area.nombre}`}
      description="El área dejará de aparecer en el listado y no se podrá asignar a cargos, jornadas ni colaboradores. Esta acción no se puede deshacer desde la aplicación."
      confirmLabel="Desactivar"
      variant="destructive"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
