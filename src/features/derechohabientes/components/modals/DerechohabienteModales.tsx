import type { Derechohabiente } from "../../types/derechohabientes.types";
import { QuitarDerechohabienteModal } from "./QuitarDerechohabienteModal";
import { ReactivarDerechohabienteModal } from "./ReactivarDerechohabienteModal";
import { SustentosModal } from "./SustentosModal";

/** Modales que se abren desde las acciones de un derechohabiente */
export type DerechohabienteModal = "sustentos" | "quitar" | "reactivar";

interface DerechohabienteModalesProps {
  derechohabiente: Derechohabiente;
  /** Modal abierto; null si ninguno */
  openModal: DerechohabienteModal | null;
  onClose: () => void;
}

/**
 * Los modales de un derechohabiente: sustentos, quitar y reactivar
 */
export function DerechohabienteModales({
  derechohabiente,
  openModal,
  onClose,
}: DerechohabienteModalesProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <>
      <SustentosModal
        derechohabiente={derechohabiente}
        open={openModal === "sustentos"}
        onOpenChange={handleOpenChange}
      />
      <QuitarDerechohabienteModal
        derechohabiente={derechohabiente}
        open={openModal === "quitar"}
        onOpenChange={handleOpenChange}
      />
      <ReactivarDerechohabienteModal
        derechohabiente={derechohabiente}
        open={openModal === "reactivar"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
