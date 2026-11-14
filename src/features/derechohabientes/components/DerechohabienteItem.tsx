import { useState } from "react";
import { PaperclipIcon, UserCheckIcon, UserMinusIcon } from "lucide-react";

import { AccionButton } from "@/components/page/AccionButton";
import { Badge } from "@/components/ui/badge";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { cn } from "@/lib/utils";
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
  /** Si es un derechohabiente quitado: se ve atenuado y solo se puede reactivar */
  quitado?: boolean;
  /** Si se indica, "Reactivar" queda deshabilitado y el tooltip dice por qué */
  reactivarDisabledReason?: string;
}

/**
 * Un derechohabiente en la pestaña de la ficha, con su vínculo, edad y acciones
 */
export function DerechohabienteItem({
  derechohabiente,
  quitado = false,
  reactivarDisabledReason,
}: DerechohabienteItemProps) {
  const [openModal, setOpenModal] = useState<DerechohabienteModal | null>(null);

  const nombre = `${derechohabiente.nombres} ${derechohabiente.apellidos}`;
  const nacimiento = toDateInput(derechohabiente.fecha_nacimiento);
  const edad = getAge(nacimiento);

  return (
    <li
      className={cn(
        "space-y-3 rounded-lg border bg-card p-4",
        quitado && "bg-muted/40 opacity-75",
      )}
    >
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

        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge variant="outline">
            {getOptionLabel(VINCULO_OPTIONS, derechohabiente.vinculo)}
          </Badge>
          {quitado && <Badge variant="secondary">Quitado</Badge>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t pt-3">
        <p className="text-sm text-muted-foreground">
          {edad} {edad === 1 ? "año" : "años"}, nació el {formatDate(nacimiento)}
        </p>

        <div className="flex items-center gap-1">
          {quitado ? (
            <AccionButton
              label="Reactivar"
              icon={UserCheckIcon}
              onClick={() => setOpenModal("reactivar")}
              tone="success"
              disabledReason={reactivarDisabledReason}
            />
          ) : (
            <>
              <AccionButton
                label="Sustentos"
                icon={PaperclipIcon}
                onClick={() => setOpenModal("sustentos")}
                tone="info"
              />
              <AccionButton
                label="Quitar"
                icon={UserMinusIcon}
                onClick={() => setOpenModal("quitar")}
                tone="danger"
              />
            </>
          )}
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
