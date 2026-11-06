import type { ReactNode } from "react";

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

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Normalmente un `ConfirmModalBody` */
  children: ReactNode;
}

/**
 * Cascarón de un modal de confirmación
 *
 * @remarks
 * El cuerpo va como hijo: se monta al abrir y se desmonta al cerrar. Así la mutación
 * que crea y el error de un intento anterior se descartan solos al cerrar.
 */
export function ConfirmModal({
  open,
  onOpenChange,
  children,
}: ConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>{children}</AlertDialogContent>
    </AlertDialog>
  );
}

interface ConfirmModalBodyProps {
  title: ReactNode;
  description: ReactNode;
  confirmLabel: string;
  /** Por defecto "Cancelar" */
  cancelLabel?: string;
  /** "destructive" para anular, quitar o dar de baja */
  variant?: "default" | "destructive";
  isPending?: boolean;
  /** Error de la mutación; si es null o undefined no se muestra nada */
  error?: unknown;
  onConfirm: () => void;
}

/**
 * Título, descripción, error y botones (cancelar y confirmar) de un modal de confirmación
 */
export function ConfirmModalBody({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "default",
  isPending = false,
  error,
  onConfirm,
}: ConfirmModalBodyProps) {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>

      <ErrorAlert error={error} />

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction
          variant={variant}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending && <Spinner data-icon="inline-start" />}
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
