import { useState } from "react";
import {
  BanIcon,
  CornerDownRightIcon,
  EllipsisVerticalIcon,
  FileCheckIcon,
  FileClockIcon,
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
import { getTodayIsoDate } from "@/lib/date.utils";
import { formatDate } from "@/lib/format.utils";
import { cn } from "@/lib/utils";
import {
  ALERTA_VENCIMIENTO_STYLES,
  ESTADO_CONTRATO_DOT,
  ESTADO_CONTRATO_LABELS,
  ESTADO_CONTRATO_STYLES,
} from "../config/contratos.config";
import { useModalidadesContrato } from "../hooks/useCatalogos";
import type { Contrato } from "../types/contratos.types";
import {
  getProgresoContrato,
  puedeEditar,
  puedeRenovar,
  puedeSubirPdf,
} from "../utils/contratos.utils";
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
 * Un contrato en la línea de tiempo de la ficha: vigencia, estado, PDF y menú de acciones
 *
 * @remarks
 * Un contrato vigente con fecha de fin muestra una barra con lo que ya
 * transcurrió y los días que faltan; los demás se ven más discretos.
 */
export function ContratoItem({ contrato, empleadoActivo }: ContratoItemProps) {
  const [openModal, setOpenModal] = useState<ContratoModal | null>(null);
  const modalidades = useModalidadesContrato();

  const esVigente = contrato.estado === "VIGENTE";
  const hoy = getTodayIsoDate();
  const aunNoEmpieza = contrato.fecha_inicio.slice(0, 10) > hoy;
  const progreso = getProgresoContrato(
    contrato.fecha_inicio,
    contrato.fecha_fin,
    hoy,
  );
  const mostrarVencimiento =
    esVigente &&
    contrato.dias_restantes !== null &&
    contrato.dias_restantes >= 0;

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
  ];

  return (
    <li className="relative pl-8">
      {/* Punto de la línea de tiempo; su color es el estado del contrato */}
      <span
        aria-hidden
        className={cn(
          "absolute top-5 left-0 size-3.5 rounded-full ring-4 ring-background",
          ESTADO_CONTRATO_DOT[contrato.estado],
        )}
      />

      <div
        className={cn(
          "space-y-3 rounded-lg border bg-card p-4",
          esVigente && "border-emerald-200 shadow-xs",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h3 className="text-base font-semibold">
              {getOptionLabel(modalidades.data, contrato.tipo_modalidad)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {contrato.fecha_fin
                ? `Del ${formatDate(contrato.fecha_inicio)} al ${formatDate(contrato.fecha_fin)}`
                : `Desde el ${formatDate(contrato.fecha_inicio)}, sin fecha de fin`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Badge
              variant="outline"
              className={ESTADO_CONTRATO_STYLES[contrato.estado]}
            >
              {ESTADO_CONTRATO_LABELS[contrato.estado]}
            </Badge>
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
          </div>
        </div>

        {esVigente && progreso !== null && (
          <div className="space-y-1.5">
            {aunNoEmpieza ? (
              <p className="text-sm text-muted-foreground">
                Empieza el {formatDate(contrato.fecha_inicio)}
              </p>
            ) : (
              <div
                role="progressbar"
                aria-label="Avance del contrato"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progreso)}
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            )}
            {mostrarVencimiento && (
              <p
                className={cn(
                  "text-sm",
                  contrato.alerta_vencimiento
                    ? ALERTA_VENCIMIENTO_STYLES[contrato.alerta_vencimiento]
                    : "text-muted-foreground",
                )}
              >
                Vence en {contrato.dias_restantes} días
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {contrato.tiene_archivo ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <FileCheckIcon className="size-4" aria-hidden />
              PDF firmado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <FileClockIcon className="size-4" aria-hidden />
              Falta adjuntar el PDF firmado
            </span>
          )}
          {contrato.es_prorroga && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <CornerDownRightIcon className="size-4" aria-hidden />
              Renovación del contrato anterior
            </span>
          )}
        </div>
      </div>

      <ContratoModales
        contrato={contrato}
        openModal={openModal}
        onClose={() => setOpenModal(null)}
      />
    </li>
  );
}
