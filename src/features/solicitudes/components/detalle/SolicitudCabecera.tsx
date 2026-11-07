import type { ComponentProps } from "react";
import {
  BanIcon,
  CheckIcon,
  HandIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";

import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getEstadoLabel,
  getEstadoTone,
  getTipoLabel,
} from "../../config/solicitudes.config";
import { estaAbierta } from "../../utils/solicitudes.utils";
import type {
  AccionesSolicitud,
  AccionSolicitud,
  SolicitudDetalle,
} from "../../types/solicitudes.types";

interface AccionTextoProps {
  label: string;
  icon: LucideIcon;
  variant?: ComponentProps<typeof Button>["variant"];
  /** Si se indica, el botón queda deshabilitado y el tooltip explica por qué */
  disabledReason: string | null;
  onClick: () => void;
}

/** Botón con texto de una acción; deshabilitado, su motivo sale en un tooltip */
function AccionTexto({
  label,
  icon: Icon,
  variant = "outline",
  disabledReason,
  onClick,
}: AccionTextoProps) {
  if (disabledReason === null)
    return (
      <Button type="button" variant={variant} onClick={onClick}>
        <Icon data-icon="inline-start" />
        {label}
      </Button>
    );

  // Un botón deshabilitado no recibe el puntero: el tooltip se engancha a un span
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        <Button type="button" variant={variant} disabled>
          <Icon data-icon="inline-start" />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{disabledReason}</TooltipContent>
    </Tooltip>
  );
}

interface SolicitudCabeceraProps {
  id: string;
  solicitud: SolicitudDetalle;
  acciones: AccionesSolicitud;
  onAccion: (accion: AccionSolicitud) => void;
}

/**
 * Cabecera del detalle: código, tipo, estado y las acciones de la solicitud
 *
 * @remarks
 * Con la solicitud abierta, las acciones que no se pueden hacer siguen
 * visibles, deshabilitadas, con el motivo en un tooltip (por ejemplo, que otra
 * persona la tomó). Con veredicto (aprobada, rechazada o anulada) no hay
 * acciones y los botones se ocultan.
 */
export function SolicitudCabecera({
  id,
  solicitud,
  acciones,
  onAccion,
}: SolicitudCabeceraProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 id={id} className="text-2xl font-semibold">
            {solicitud.codigo}
          </h1>
          <StatusBadge tone={getEstadoTone(solicitud.estado)} withDot>
            {getEstadoLabel(solicitud.estado)}
          </StatusBadge>
        </div>
        <p className="text-sm text-muted-foreground">
          {getTipoLabel(solicitud.tipo)} de{" "}
          {solicitud.colaborador_resumen.nombre_completo}
        </p>
      </div>

      {estaAbierta(solicitud.estado) && (
        <div className="flex flex-wrap gap-2">
          <AccionTexto
            label="Tomar"
            icon={HandIcon}
            variant="default"
            disabledReason={acciones.tomar}
            onClick={() => onAccion("tomar")}
          />
          <AccionTexto
            label="Aprobar"
            icon={CheckIcon}
            disabledReason={acciones.aprobar}
            onClick={() => onAccion("aprobar")}
          />
          <AccionTexto
            label="Rechazar"
            icon={XIcon}
            disabledReason={acciones.rechazar}
            onClick={() => onAccion("rechazar")}
          />
          <AccionTexto
            label="Anular"
            icon={BanIcon}
            variant="destructive"
            disabledReason={acciones.anular}
            onClick={() => onAccion("anular")}
          />
        </div>
      )}
    </header>
  );
}
