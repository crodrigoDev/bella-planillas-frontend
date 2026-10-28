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
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onStay();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Salir del registro?</AlertDialogTitle>
          <AlertDialogDescription>
            El empleado ya se creó, pero faltan datos por guardar. Si sales
            ahora, su registro quedará incompleto en el sistema y se perderá lo
            que escribiste.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Seguir aquí</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onLeave}>
            Salir de todos modos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
