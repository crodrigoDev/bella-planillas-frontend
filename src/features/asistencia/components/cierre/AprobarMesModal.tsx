import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { useAprobarMes } from "../../hooks/useCierreMensualActions";
import { formatPeriodo } from "../../utils/asistencia.utils";

interface AprobarMesModalProps {
  periodo: string;
  /** Pendientes del mes en todas las áreas, que es lo que aprueba el backend */
  pendientes: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para aprobar todos los resúmenes pendientes del mes
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se descarta el error de un
 * intento anterior. Es todo o nada, y el backend no distingue áreas.
 */
export function AprobarMesModal({
  periodo,
  pendientes,
  open,
  onOpenChange,
}: AprobarMesModalProps) {
  return (
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      <AprobarMesContent
        periodo={periodo}
        pendientes={pendientes}
        onClose={() => onOpenChange(false)}
      />
    </ConfirmModal>
  );
}

interface AprobarMesContentProps {
  periodo: string;
  pendientes: number;
  onClose: () => void;
}

function AprobarMesContent({
  periodo,
  pendientes,
  onClose,
}: AprobarMesContentProps) {
  const mutation = useAprobarMes(periodo);

  const handleConfirm = () => {
    mutation.mutate(undefined, { onSuccess: onClose });
  };

  return (
    <ConfirmModalBody
      title={`Aprobar ${formatPeriodo(periodo)}`}
      description={
        <>
          Se aprobarán los {pendientes} resúmenes pendientes del mes de{" "}
          <strong>todas las áreas</strong>, aunque haya un filtro aplicado. Es
          todo o nada: si uno está desactualizado, incompleto o con días por
          resolver, no se aprueba ninguno. Con un mes aprobado ya no se pueden
          registrar marcaciones ni resolver días de ese colaborador.
        </>
      }
      confirmLabel="Aprobar mes"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
