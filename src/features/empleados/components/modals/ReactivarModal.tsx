import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <ReactivarContent
          empleado={empleado}
          onClose={() => onOpenChange(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
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
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Reactivar colaborador</AlertDialogTitle>
        <AlertDialogDescription>
          {getNombreCompleto(empleado)} volverá al estado Activo y se quitará
          su fecha de cese. Revisa después su contrato, jornada y régimen
          previsional.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <ErrorAlert error={mutation.error} />

      <AlertDialogFooter>
        <AlertDialogCancel disabled={mutation.isPending}>
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Spinner data-icon="inline-start" />}
          Reactivar
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
