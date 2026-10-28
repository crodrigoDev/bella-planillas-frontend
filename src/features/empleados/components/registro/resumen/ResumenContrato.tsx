import { FileSignatureIcon } from "lucide-react";

import { FormSection } from "@/components/form/FormSection";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import { useModalidadesContrato } from "../../../hooks/useCatalogos";
import type { DatosContratoDraft } from "../../../schemas/datosContrato.schema";
import { ResumenCampo } from "./ResumenCampo";

interface ResumenContratoProps {
  contrato: DatosContratoDraft;
}

/**
 * Resumen del paso 3: modalidad y vigencia del contrato
 */
export function ResumenContrato({ contrato }: ResumenContratoProps) {
  const modalidades = useModalidadesContrato();

  return (
    <FormSection
      icon={FileSignatureIcon}
      title="Contrato"
      description="Modalidad y vigencia del vínculo laboral."
    >
      <ResumenCampo
        label="Modalidad"
        value={getOptionLabel(modalidades.data, contrato.tipo_modalidad)}
      />
      <ResumenCampo
        label="Fecha de inicio"
        value={formatDate(contrato.fecha_inicio)}
      />
      <ResumenCampo
        label="Fecha de fin"
        value={contrato.fecha_fin ? formatDate(contrato.fecha_fin) : "Sin fecha de fin"}
      />
      <ResumenCampo
        label="Observación"
        value={contrato.observacion ?? "--"}
        className="sm:col-span-2 lg:col-span-4"
      />
    </FormSection>
  );
}
