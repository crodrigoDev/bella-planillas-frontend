import type { Contrato } from "../../types/contratos.types";
import { AnularContratoModal } from "./AnularContratoModal";
import { EditarContratoModal } from "./EditarContratoModal";
import { RenovarContratoModal } from "./RenovarContratoModal";
import { SubirPdfModal } from "./SubirPdfModal";
import { VerPdfModal } from "./VerPdfModal";

/** Modales que se abren desde las acciones de un contrato */
export type ContratoModal = "editar" | "renovar" | "anular" | "subirPdf" | "verPdf";

interface ContratoModalesProps {
  contrato: Contrato;
  /** Modal abierto; null si ninguno */
  openModal: ContratoModal | null;
  onClose: () => void;
}

/**
 * Los modales de un contrato: editar, renovar, anular, adjuntar PDF y ver PDF
 *
 * @remarks
 * Los usa el menú de cada contrato de la ficha y servirá igual al módulo
 * global de contratos.
 */
export function ContratoModales({
  contrato,
  openModal,
  onClose,
}: ContratoModalesProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <>
      <EditarContratoModal
        contratoId={contrato.id}
        open={openModal === "editar"}
        onOpenChange={handleOpenChange}
      />
      <RenovarContratoModal
        contrato={contrato}
        open={openModal === "renovar"}
        onOpenChange={handleOpenChange}
      />
      <AnularContratoModal
        contrato={contrato}
        open={openModal === "anular"}
        onOpenChange={handleOpenChange}
      />
      <SubirPdfModal
        contrato={contrato}
        open={openModal === "subirPdf"}
        onOpenChange={handleOpenChange}
      />
      <VerPdfModal
        contrato={contrato}
        open={openModal === "verPdf"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
