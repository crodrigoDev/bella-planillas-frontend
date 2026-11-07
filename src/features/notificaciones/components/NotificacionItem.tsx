import { Link } from "react-router-dom";

import {
  TONE_BADGE,
  TONE_ICON,
} from "@/components/feedback/statusTone.config";
import { formatFechaHoraLima } from "@/lib/date.utils";
import { cn } from "@/lib/utils";
import { TIPO_NOTIFICACION_CONFIG } from "../config/notificaciones.config";
import type { Notificacion } from "../types/notificaciones.types";
import {
  formatTiempoRelativo,
  getNombreModulo,
  getRutaModulo,
} from "../utils/notificaciones.utils";

interface NotificacionItemProps {
  notificacion: Notificacion;
  /** Resalta la alerta que llegó después de la última vez que se abrió el panel */
  noLeida: boolean;
  /** Se llama al ir al módulo, para cerrar el panel */
  onNavigate: () => void;
}

/**
 * Una alerta del panel; si su módulo tiene pantalla, es un enlace a ella
 */
export function NotificacionItem({
  notificacion,
  noLeida,
  onNavigate,
}: NotificacionItemProps) {
  const { tone, Icon } = TIPO_NOTIFICACION_CONFIG[notificacion.tipo];
  const ruta = getRutaModulo(notificacion.modulo_origen);

  const contenido = (
    <>
      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border",
          TONE_BADGE[tone],
        )}
      >
        <Icon className={cn("size-4", TONE_ICON[tone])} aria-hidden />
      </span>

      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="block text-sm font-medium leading-snug">
          {notificacion.titulo}
        </span>
        <span className="block text-sm text-muted-foreground">
          {notificacion.mensaje}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{getNombreModulo(notificacion.modulo_origen)}</span>
          <span aria-hidden>·</span>
          <time
            dateTime={notificacion.timestamp}
            title={formatFechaHoraLima(notificacion.timestamp)}
          >
            {formatTiempoRelativo(notificacion.timestamp)}
          </time>
        </span>
      </span>

      {noLeida && (
        <span
          className="mt-2 size-2 shrink-0 rounded-full bg-primary"
          role="img"
          aria-label="No leída"
        />
      )}
    </>
  );

  const className = cn(
    "flex items-start gap-3 rounded-md px-3 py-2.5",
    noLeida && "bg-muted/60",
  );

  if (!ruta) return <li className={className}>{contenido}</li>;

  return (
    <li>
      <Link
        to={ruta}
        onClick={onNavigate}
        className={cn(className, "transition-colors hover:bg-muted")}
      >
        {contenido}
      </Link>
    </li>
  );
}
