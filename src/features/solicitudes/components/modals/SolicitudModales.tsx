import type {
  AccionSolicitud,
  SolicitudAccionable,
} from "../../types/solicitudes.types";
import { AnularSolicitudModal } from "./AnularSolicitudModal";
import { AprobarSolicitudModal } from "./AprobarSolicitudModal";
import { RechazarSolicitudModal } from "./RechazarSolicitudModal";
import { TomarSolicitudModal } from "./TomarSolicitudModal";

interface SolicitudModalesProps {
  /** Solo hace falta lo común al listado y al detalle */
  solicitud: SolicitudAccionable;
  colaboradorNombre: string;
  /** Modal abierto; `null` si no hay ninguno */
  accion: AccionSolicitud | null;
  onClose: () => void;
}

/**
 * Los cuatro modales de acción de una solicitud (tomar, aprobar, rechazar y anular)
 *
 * @remarks
 * Quien lo usa guarda cuál está abierto en `accion`. Cada modal se monta solo
 * cuando le toca, así que empieza limpio cada vez que se abre.
 */
export function SolicitudModales({
  solicitud,
  colaboradorNombre,
  accion,
  onClose,
}: SolicitudModalesProps) {
  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <>
      <TomarSolicitudModal
        solicitud={solicitud}
        open={accion === "tomar"}
        onOpenChange={onOpenChange}
      />
      <AprobarSolicitudModal
        solicitud={solicitud}
        colaboradorNombre={colaboradorNombre}
        open={accion === "aprobar"}
        onOpenChange={onOpenChange}
      />
      <RechazarSolicitudModal
        solicitud={solicitud}
        open={accion === "rechazar"}
        onOpenChange={onOpenChange}
      />
      <AnularSolicitudModal
        solicitud={solicitud}
        open={accion === "anular"}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
