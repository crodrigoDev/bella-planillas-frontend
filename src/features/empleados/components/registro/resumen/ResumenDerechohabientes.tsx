import { FormSection } from "@/components/form/FormSection";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import { VINCULO_OPTIONS } from "@/features/derechohabientes/config/derechohabientes.config";
import type { DerechohabienteDraft } from "../../../schemas/datosDerechohabiente.schema";

interface ResumenDerechohabientesProps {
  derechohabientes: DerechohabienteDraft[];
}

/**
 * Resumen del paso 4: los familiares que se van a registrar
 */
export function ResumenDerechohabientes({
  derechohabientes,
}: ResumenDerechohabientesProps) {
  return (
    <FormSection
      title="Derechohabientes"
      description="Familiares con derecho a beneficios."
    >
      {derechohabientes.length === 0 ? (
        <p className="text-sm text-muted-foreground col-span-full">
          No se agregaron derechohabientes.
        </p>
      ) : (
        <ul className="space-y-2 col-span-full">
          {derechohabientes.map((item) => (
            <li
              key={item.nro_documento}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <p className="font-medium">
                {item.nombres} {item.apellidos}
              </p>
              <p className="text-muted-foreground">
                {getOptionLabel(VINCULO_OPTIONS, item.vinculo)} ·{" "}
                {item.nro_documento} · Nació el{" "}
                {formatDate(item.fecha_nacimiento)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </FormSection>
  );
}
