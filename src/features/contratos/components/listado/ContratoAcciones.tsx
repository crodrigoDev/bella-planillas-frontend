import { useState } from "react";
import {
  CircleXIcon,
  FileTextIcon,
  PencilIcon,
  UploadIcon,
} from "lucide-react";

import { AccionButton } from "@/components/page/AccionButton";
import type { ContratoGlobal } from "../../types/contratos.types";
import { puedeEditar, puedeSubirPdf } from "../../utils/contratos.utils";
import {
  ContratoModales,
  type ContratoModal,
} from "../modals/ContratoModales";

interface ContratoAccionesProps {
  contrato: ContratoGlobal;
}

/**
 * Botones de acción de una fila del listado global de contratos y los modales que abren
 *
 * @remarks
 * Sigue las mismas reglas que la ficha, pero sin "Renovar": el listado no trae
 * si el colaborador está activo, y renovar lo exige. Renovar y crear contratos
 * se hacen desde la ficha.
 */
export function ContratoAcciones({ contrato }: ContratoAccionesProps) {
  const [openModal, setOpenModal] = useState<ContratoModal | null>(null);

  return (
    <>
      <div className="flex items-center gap-1">
        {contrato.tiene_archivo && (
          <AccionButton
            label="Ver PDF"
            icon={FileTextIcon}
            onClick={() => setOpenModal("verPdf")}
          />
        )}
        {puedeEditar(contrato) && (
          <AccionButton
            label="Editar"
            icon={PencilIcon}
            onClick={() => setOpenModal("editar")}
          />
        )}
        {puedeSubirPdf(contrato) && (
          <AccionButton
            label="Adjuntar PDF"
            icon={UploadIcon}
            onClick={() => setOpenModal("subirPdf")}
            tone="info"
          />
        )}
        <AccionButton
          label="Anular"
          icon={CircleXIcon}
          onClick={() => setOpenModal("anular")}
          tone="danger"
        />
      </div>

      <ContratoModales
        contrato={contrato}
        openModal={openModal}
        onClose={() => setOpenModal(null)}
      />
    </>
  );
}
