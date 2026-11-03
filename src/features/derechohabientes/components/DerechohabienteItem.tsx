import { useState } from "react";
import { PaperclipIcon, UserMinusIcon } from "lucide-react";

import { AccionButton } from "@/components/page/AccionButton";
import { Badge } from "@/components/ui/badge";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { getAge, toDateInput } from "@/lib/date.utils";
import { formatDate } from "@/lib/format.utils";
import { VINCULO_OPTIONS } from "../config/derechohabientes.config";
import type { Derechohabiente } from "../types/derechohabientes.types";
import { getIniciales } from "../utils/derechohabientes.utils";
import {
  DerechohabienteModales,
  type DerechohabienteModal,
} from "./modals/DerechohabienteModales";

interface DerechohabienteItemProps {
  derechohabiente: Derechohabiente;
}

/**
 * Un derechohabiente en la pestaña de la ficha, con su vínculo, edad y acciones
 */
export function DerechohabienteItem({
  derechohabiente,
}: DerechohabienteItemProps) {
  const [openModal, setOpenModal] = useState<DerechohabienteModal | null>(null);

  const nombre = `${derechohabiente.nombres} ${derechohabiente.apellidos}`;
  const nacimiento = toDateInput(derechohabiente.fecha_nacimiento);
  const edad = getAge(nacimiento);

  return (
    <li className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
        >
          {getIniciales(derechohabiente.nombres, derechohabiente.apellidos)}
        </span>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-semibold wrap-break-word">{nombre}</h3>
          <p className="text-sm text-muted-foreground">
            {derechohabiente.tipo_documento.tipo_documento}{" "}
            {derechohabiente.nro_documento}
          </p>
        </div>

        <Badge variant="outline" className="shrink-0">
          {getOptionLabel(VINCULO_OPTIONS, derechohabiente.vinculo)}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-2 border-t pt-3">
        <p className="text-sm text-muted-foreground">
          {edad} {edad === 1 ? "año" : "años"}, nació el {formatDate(nacimiento)}
        </p>

        <div className="flex items-center gap-1">
          <AccionButton
            label="Sustentos"
            icon={PaperclipIcon}
            onClick={() => setOpenModal("sustentos")}
            className="text-sky-600"
          />
          <AccionButton
            label="Quitar"
            icon={UserMinusIcon}
            onClick={() => setOpenModal("quitar")}
            className="text-red-500"
          />
        </div>
      </div>

      <DerechohabienteModales
        derechohabiente={derechohabiente}
        openModal={openModal}
        onClose={() => setOpenModal(null)}
      />
    </li>
  );
}
