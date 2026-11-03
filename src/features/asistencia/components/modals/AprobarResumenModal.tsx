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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AprobarResumenContent
          empleadoId={empleadoId}
          periodo={periodo}
          onClose={() => onOpenChange(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
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
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Aprobar el resumen de {formatPeriodo(periodo)}
        </AlertDialogTitle>
        <AlertDialogDescription>
          Con el resumen aprobado ya no se pueden registrar marcaciones ni
          resolver días de este mes. Para cambiar algo habrá que reabrirlo.
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
          Aprobar
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
