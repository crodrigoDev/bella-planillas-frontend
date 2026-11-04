import { LoadingButton } from "@/components/form/LoadingButton";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

interface ModalFormFooterProps {
  isPending: boolean;
  submitLabel: string;
  /** Texto del botón mientras espera; por defecto "Guardando…" */
  loadingText?: string;
  /** "destructive" para acciones como dar de baja */
  variant?: "default" | "destructive";
  /** Bloquea el envío, por ejemplo mientras falta un dato obligatorio */
  disabled?: boolean;
  /** Por defecto "Cancelar" */
  cancelLabel?: string;
}

/**
 * Pie de un formulario en un modal: botón para cancelar y botón para enviar
 *
 * @remarks
 * Debe ir dentro del `<form>`: el botón de envío es `type="submit"`.
 */
export function ModalFormFooter({
  isPending,
  submitLabel,
  loadingText = "Guardando…",
  variant = "default",
  disabled,
  cancelLabel = "Cancelar",
}: ModalFormFooterProps) {
  return (
    <DialogFooter>
      <DialogClose
        render={<Button type="button" variant="outline" />}
        disabled={isPending}
      >
        {cancelLabel}
      </DialogClose>
      <LoadingButton
        type="submit"
        variant={variant}
        isLoading={isPending}
        loadingText={loadingText}
        disabled={disabled}
      >
        {submitLabel}
      </LoadingButton>
    </DialogFooter>
  );
}
