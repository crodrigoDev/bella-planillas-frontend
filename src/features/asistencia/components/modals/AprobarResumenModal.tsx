import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { useAprobarResumen } from "../../hooks/useAsistenciaActions";
import { formatPeriodo } from "../../utils/asistencia.utils";

interface AprobarResumenModalProps {
  empleadoId: string;
  periodo: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para aprobar el resumen de un mes
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se
 * descarta el error de un intento anterior. Aprobar congela el mes: para
 * tocarlo después hay que reabrirlo.
 */
export function AprobarResumenModal({
  empleadoId,
  periodo,
  open,
  onOpenChange,
}: AprobarResumenModalProps) {
  return (
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      <AprobarResumenContent
        empleadoId={empleadoId}
        periodo={periodo}
        onClose={() => onOpenChange(false)}
      />
    </ConfirmModal>
  );
}

interface AprobarResumenContentProps {
  empleadoId: string;
  periodo: string;
  onClose: () => void;
}

function AprobarResumenContent({
  empleadoId,
  periodo,
  onClose,
}: AprobarResumenContentProps) {
  const mutation = useAprobarResumen(empleadoId, periodo);

  const handleConfirm = () => {
    mutation.mutate(undefined, { onSuccess: onClose });
  };

  return (
    <ConfirmModalBody
      title={`Aprobar el resumen de ${formatPeriodo(periodo)}`}
      description={
        <>
          Con el resumen aprobado ya no se pueden registrar marcaciones ni
          resolver días de este mes. Para cambiar algo habrá que reabrirlo.
        </>
      }
      confirmLabel="Aprobar"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
