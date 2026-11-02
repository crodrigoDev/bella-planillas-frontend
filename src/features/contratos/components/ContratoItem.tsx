import { useState } from "react";
import {
  CircleXIcon,
  CornerDownRightIcon,
  FileTextIcon,
  FileXIcon,
  PencilIcon,
  RefreshCwIcon,
  UploadIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ContratoAccionButton } from "./ContratoAccionButton";
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
  // El backend no cambia el estado al pasar la fecha de fin: un contrato
  // sigue Vigente aunque ya haya vencido
  const diasVencido =
    esVigente && contrato.dias_restantes !== null && contrato.dias_restantes < 0
      ? Math.abs(contrato.dias_restantes)
      : null;
  const mostrarVencimiento =
    esVigente &&
    contrato.dias_restantes !== null &&
    contrato.dias_restantes >= 0;

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

          <div className="shrink-0">
            <Badge
              variant="outline"
              className={ESTADO_CONTRATO_STYLES[contrato.estado]}
            >
              {ESTADO_CONTRATO_LABELS[contrato.estado]}
            </Badge>
          </div>
        </div>

        {diasVencido !== null && (
          <p className="text-sm text-red-600">
            Venció hace {diasVencido} {diasVencido === 1 ? "día" : "días"}
          </p>
        )}

        {esVigente && progreso !== null && diasVencido === null && (
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

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {contrato.tiene_archivo ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenModal("verPdf")}
              >
                <FileTextIcon data-icon="inline-start" />
                Ver PDF
              </Button>
            ) : (
              <span className="inline-flex h-9 items-center gap-1.5 rounded-md bg-muted px-3 text-sm text-muted-foreground">
                <FileXIcon className="size-4" aria-hidden />
                Sin PDF
              </span>
            )}
            {contrato.es_prorroga && (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CornerDownRightIcon className="size-4" aria-hidden />
                Renovación del contrato anterior
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {puedeEditar(contrato) && (
              <ContratoAccionButton
                label="Editar"
                icon={PencilIcon}
                onClick={() => setOpenModal("editar")}
              />
            )}
            {puedeSubirPdf(contrato) && (
              <ContratoAccionButton
                label="Adjuntar PDF"
                icon={UploadIcon}
                onClick={() => setOpenModal("subirPdf")}
                className="text-sky-600"
              />
            )}
            {puedeRenovar(contrato, empleadoActivo) && (
              <ContratoAccionButton
                label="Renovar"
                icon={RefreshCwIcon}
                onClick={() => setOpenModal("renovar")}
                className="text-emerald-600"
              />
            )}
            <ContratoAccionButton
              label="Anular"
              icon={CircleXIcon}
              onClick={() => setOpenModal("anular")}
              className="text-red-500"
            />
          </div>
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
