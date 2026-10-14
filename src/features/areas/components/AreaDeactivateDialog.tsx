import { CircleHelp, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { AreaViewModel } from "@/features/areas/types/areas.types";

/** Datos y acciones del aviso de desactivación. */
interface AreaDeactivateDialogProps {
  /** Área cuya desactivación se solicita. */
  area: AreaViewModel;
  /** Cierra el aviso sin modificar el área. */
  onClose: () => void;
  /** Confirma la desactivación de un área sin vínculos activos. */
  onConfirm: () => void;
}

/**
 * Bloquea la desactivación si hay empleados o cargos activos.
 * En caso contrario, solicita confirmación.
 */
export function AreaDeactivateDialog({
  area,
  onClose,
  onConfirm,
}: AreaDeactivateDialogProps) {
  const isBlocked = area.activeEmployees > 0 || area.activePositions > 0;

  const Icon = isBlocked ? TriangleAlert : CircleHelp;

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <div
            className={
              isBlocked
                ? "mb-3 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950"
                : "mb-3 flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950"
            }
          >
            <Icon aria-hidden="true" className="size-6" />
          </div>

          <AlertDialogTitle>
            {isBlocked
              ? "No se puede desactivar esta área"
              : "¿Deseas desactivar esta área?"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {isBlocked
              ? `Tiene ${area.activeEmployees} empleados activos y ${area.activePositions} cargos activos. Reasigna los empleados y reasigna o desactiva los cargos antes de continuar.`
              : "Esta área no tiene colaboradores ni cargos vinculados y pasará al estado inactivo."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {isBlocked ? (
            <Button onClick={onClose} className="h-9 text-xs">
              Entendido
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>

              <Button variant="destructive" onClick={onConfirm}>
                Desactivar área
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
