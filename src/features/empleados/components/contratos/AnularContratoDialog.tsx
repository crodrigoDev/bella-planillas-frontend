import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { formatEmpleadoFecha } from "../../utils/empleados.utils";
import type { ContratoEmpleado } from "../../types/ficha-empleado.types";

interface AnularContratoDialogProps {
  contrato: ContratoEmpleado;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

/** Confirma la anulacion antes de retirar el contrato del listado */
export default function AnularContratoDialog({ contrato, onClose, onConfirm }: AnularContratoDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const confirm = async (): Promise<void> => {
    setPending(true); setError(null);
    try { await onConfirm(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo anular el contrato"); }
    finally { setPending(false); }
  };
  return (
    <Dialog open onOpenChange={(open) => { if (!open && !pending) onClose(); }}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader><DialogTitle>Anular contrato</DialogTitle><DialogDescription>Contrato iniciado el {formatEmpleadoFecha(contrato.fecha_inicio)}</DialogDescription></DialogHeader>
        <p className="text-sm text-muted-foreground">El contrato quedará anulado y dejará de aparecer en este listado. Sus datos se conservarán.</p>
        <FieldError>{error}</FieldError>
        <DialogFooter><Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancelar</Button><Button type="button" variant="destructive" disabled={pending} onClick={() => { void confirm(); }}>{pending ? "Anulando…" : "Confirmar anulación"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
