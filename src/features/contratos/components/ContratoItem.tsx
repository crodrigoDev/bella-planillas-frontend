import { useState } from "react";
import {
  BanIcon,
  EllipsisVerticalIcon,
  FileTextIcon,
  PencilIcon,
  RefreshCwIcon,
  UploadIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import {
  ESTADO_CONTRATO_LABELS,
  ESTADO_CONTRATO_STYLES,
} from "../config/contratos.config";
import { useModalidadesContrato } from "../hooks/useCatalogos";
import type { Contrato } from "../types/contratos.types";
import { puedeEditar, puedeRenovar, puedeSubirPdf } from "../utils/contratos.utils";
import {
  ContratoModales,
  type ContratoModal,
} from "./modals/ContratoModales";

interface ContratoItemProps {
  contrato: Contrato;
  /** Si el empleado está de baja, no se puede renovar su contrato */
  empleadoActivo: boolean;
}

/**
 * Un contrato en la lista de la ficha, con su estado y el menú de acciones
 */
export function ContratoItem({
  contrato,
  empleadoActivo,
}: ContratoItemProps) {
  const [openModal, setOpenModal] = useState<ContratoModal | null>(null);
  const modalidades = useModalidadesContrato();

  const acciones = [
    contrato.tiene_archivo && (
      <DropdownMenuItem key="verPdf" onClick={() => setOpenModal("verPdf")}>
        <FileTextIcon />
        Ver PDF
      </DropdownMenuItem>
    ),
    puedeSubirPdf(contrato) && (
      <DropdownMenuItem
        key="subirPdf"
        onClick={() => setOpenModal("subirPdf")}
      >
        <UploadIcon />
        Adjuntar PDF
      </DropdownMenuItem>
    ),
    puedeEditar(contrato) && (
      <DropdownMenuItem key="editar" onClick={() => setOpenModal("editar")}>
        <PencilIcon />
        Editar
      </DropdownMenuItem>
    ),
    puedeRenovar(contrato, empleadoActivo) && (
      <DropdownMenuItem key="renovar" onClick={() => setOpenModal("renovar")}>
        <RefreshCwIcon />
        Renovar
      </DropdownMenuItem>
    ),
    <DropdownMenuItem
      key="anular"
      variant="destructive"
      onClick={() => setOpenModal("anular")}
    >
      <BanIcon />
      Anular
    </DropdownMenuItem>,
  ].filter(Boolean);

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">
          {getOptionLabel(modalidades.data, contrato.tipo_modalidad)}
          {contrato.es_prorroga && (
            <span className="font-normal text-muted-foreground">
              {" "}
              · Prórroga
            </span>
          )}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDate(contrato.fecha_inicio)} al{" "}
          {contrato.fecha_fin
            ? formatDate(contrato.fecha_fin)
            : "sin fecha de fin"}
          {contrato.estado === "VIGENTE" &&
            contrato.dias_restantes !== null &&
            contrato.dias_restantes >= 0 &&
            ` · vence en ${contrato.dias_restantes} días`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={ESTADO_CONTRATO_STYLES[contrato.estado]}
        >
          {ESTADO_CONTRATO_LABELS[contrato.estado]}
        </Badge>

        {acciones.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Acciones del contrato"
                />
              }
            >
              <EllipsisVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{acciones}</DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <ContratoModales
        contrato={contrato}
        openModal={openModal}
        onClose={() => setOpenModal(null)}
      />
    </li>
  );
}
