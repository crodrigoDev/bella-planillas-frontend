import { useState } from "react";
import { UserRoundMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import type { EmpleadoListado } from "../../types/empleados.types";
import { getEmpleadoNombre } from "../../utils/empleados.utils";

interface DarBajaEmpleadoDialogProps {
  empleado: EmpleadoListado;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

/** Pide confirmacion antes de marcar el empleado como cesado e inactivo */
export default function DarBajaEmpleadoDialog({ empleado, onClose, onConfirm }: DarBajaEmpleadoDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirm = async (): Promise<void> => {
    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirm();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo dar de baja al empleado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md" showCloseButton={!isSubmitting}>
        <DialogHeader>
          <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive"><UserRoundMinus aria-hidden="true" className="size-5" /></span>
          <DialogTitle>Dar de baja al empleado</DialogTitle>
          <DialogDescription>{getEmpleadoNombre(empleado)} · {empleado.nro_documento}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>El empleado pasará a <strong className="text-foreground">Cesado</strong> y su registro quedará inactivo. Sus datos se conservarán.</p>
          <p>La fecha de cese será la fecha actual al confirmar la baja.</p>
          <p className="text-xs">Este cambio es temporal en la vista de prueba</p>
        </div>
        <FieldError>{error}</FieldError>
        <DialogFooter>
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>Cancelar</Button>
          <Button type="button" variant="destructive" disabled={isSubmitting} onClick={() => { void confirm(); }}>{isSubmitting ? "Procesando…" : "Confirmar baja"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
