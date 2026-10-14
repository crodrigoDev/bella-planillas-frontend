import { useState } from "react";
import type { ActualizarDatoFinancieroDto, CrearDatoFinancieroDto } from "@jyp/shared-contracts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FinancieroEmpleado } from "../../types/financiero-empleado.types";
import CrearFinancieroForm from "./CrearFinancieroForm";
import EditarFinancieroForm from "./EditarFinancieroForm";

interface FinancieroEmpleadoDialogProps {
  empleadoId: string;
  financiero: FinancieroEmpleado | null;
  onClose: () => void;
  onCreate: (values: CrearDatoFinancieroDto) => void | Promise<void>;
  onEdit: (values: ActualizarDatoFinancieroDto) => void | Promise<void>;
}

/** Abre el registro o la edicion financiera dentro de la ficha */
export default function FinancieroEmpleadoDialog({ empleadoId, financiero, onClose, onCreate, onEdit }: FinancieroEmpleadoDialogProps) {
  const [pending, setPending] = useState(false);
  const execute = async (action: () => void | Promise<void>): Promise<void> => {
    setPending(true);
    try { await action(); } finally { setPending(false); }
  };
  return (
    <Dialog open onOpenChange={(open) => { if (!open && !pending) onClose(); }}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-3xl" showCloseButton={!pending}>
        <DialogHeader><DialogTitle>{financiero ? "Editar datos financieros" : "Registrar datos financieros"}</DialogTitle><DialogDescription>Remuneración, pensión, salud y cuentas del colaborador</DialogDescription></DialogHeader>
        {financiero ? <EditarFinancieroForm financiero={financiero} onClose={onClose} onSubmit={(values) => execute(() => onEdit(values))} /> : <CrearFinancieroForm empleadoId={empleadoId} onClose={onClose} onSubmit={(values) => execute(() => onCreate(values))} />}
      </DialogContent>
    </Dialog>
  );
}
