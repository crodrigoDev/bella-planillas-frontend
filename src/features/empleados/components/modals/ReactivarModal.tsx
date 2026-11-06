import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { useReactivarEmpleado } from "../../hooks/useEmpleadoActions";
import type { Empleado } from "../../types/empleados.types";
import { getNombreCompleto } from "../../utils/empleados.utils";

interface ReactivarModalProps {
  empleado: Empleado;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de confirmación para reactivar a un empleado dado de baja
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y se
 * descarta el error de un intento anterior.
 */
export function ReactivarModal({
  empleado,
  open,
  onOpenChange,
}: ReactivarModalProps) {
  return (
    <ConfirmModal open={open} onOpenChange={onOpenChange}>
      <ReactivarContent
        empleado={empleado}
        onClose={() => onOpenChange(false)}
      />
    </ConfirmModal>
  );
}

interface ReactivarContentProps {
  empleado: Empleado;
  onClose: () => void;
}

function ReactivarContent({ empleado, onClose }: ReactivarContentProps) {
  const mutation = useReactivarEmpleado();

  const handleConfirm = () => {
    mutation.mutate(empleado, { onSuccess: onClose });
  };

  return (
    <ConfirmModalBody
      title="Reactivar colaborador"
      description={
        <>
          {getNombreCompleto(empleado)} volverá al estado Activo y se quitará
          su fecha de cese. Revisa después su contrato, jornada y régimen
          previsional.
        </>
      }
      confirmLabel="Reactivar"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
