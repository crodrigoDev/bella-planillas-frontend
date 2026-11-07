import { PencilIcon, Trash2Icon } from "lucide-react";

import { AccionButton } from "@/components/page/AccionButton";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { VINCULO_OPTIONS } from "@/features/derechohabientes/config/derechohabientes.config";
import type { DerechohabienteDraft } from "@/features/derechohabientes/schemas/datosDerechohabiente.schema";

interface DerechohabientesListProps {
  derechohabientes: DerechohabienteDraft[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

/**
 * Lista de los derechohabientes agregados, con botones para editar y quitar
 */
export function DerechohabientesList({
  derechohabientes,
  onEdit,
  onRemove,
}: DerechohabientesListProps) {
  if (derechohabientes.length === 0)
    return (
      <p className="text-sm text-muted-foreground col-span-full">
        Aún no agregaste ningún derechohabiente.
      </p>
    );

  return (
    <ul className="space-y-2 col-span-full">
      {derechohabientes.map((item, index) => {
        const nombre = `${item.nombres} ${item.apellidos}`;

        return (
          <li
            key={item.nro_documento}
            className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{nombre}</p>
              <p className="text-muted-foreground">
                {getOptionLabel(VINCULO_OPTIONS, item.vinculo)} · {item.nro_documento}
              </p>
            </div>

            <div className="flex gap-1">
              <AccionButton
                label={`Editar a ${nombre}`}
                icon={PencilIcon}
                onClick={() => onEdit(index)}
              />
              <AccionButton
                label={`Quitar a ${nombre}`}
                icon={Trash2Icon}
                tone="danger"
                onClick={() => onRemove(index)}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
