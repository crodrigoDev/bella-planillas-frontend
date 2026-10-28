import { PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VINCULO_OPTIONS } from "../../config/empleados.config";
import type { DerechohabienteDraft } from "../../schemas/datosDerechohabiente.schema";

interface DerechohabientesListProps {
  derechohabientes: DerechohabienteDraft[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const getVinculoLabel = (vinculo: string) =>
  VINCULO_OPTIONS.find((option) => option.value === vinculo)?.label ?? vinculo;

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
      <p className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-4">
        Aún no agregaste ningún derechohabiente.
      </p>
    );

  return (
    <ul className="space-y-2 sm:col-span-2 lg:col-span-4">
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
                {getVinculoLabel(item.vinculo)} · {item.nro_documento}
              </p>
            </div>

            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Editar a ${nombre}`}
                onClick={() => onEdit(index)}
              >
                <PencilIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Quitar a ${nombre}`}
                onClick={() => onRemove(index)}
              >
                <Trash2Icon />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
