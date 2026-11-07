import { useState } from "react";
import { BellIcon } from "lucide-react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificaciones } from "../hooks/useNotificaciones";
import { useNotificacionesSocket } from "../hooks/useNotificacionesSocket";
import { useNotificacionesVistas } from "../hooks/useNotificacionesVistas";
import { contarNoLeidas, esNoLeida } from "../utils/notificaciones.utils";
import { NotificacionItem } from "./NotificacionItem";

interface NotificacionesButtonProps {
  /** Usuario con sesión: separa lo ya visto de cada persona */
  userId: string;
  /** Devuelve el access token vigente para el tiempo real */
  getToken: () => string | null;
  /** Renueva el access token cuando el servidor corta la conexión por vencimiento */
  renovarToken: () => Promise<string>;
}

/**
 * Campana del header con el contador de no leídas y el panel de alertas
 *
 * @remarks
 * Al abrir el panel se marcan todas como vistas, pero las que eran nuevas
 * siguen resaltadas mientras esté abierto.
 */
export function NotificacionesButton({
  userId,
  getToken,
  renovarToken,
}: NotificacionesButtonProps) {
  const [open, setOpen] = useState(false);
  // Fecha de corte con la que se resalta lo nuevo mientras el panel está abierto
  const [resaltarDesde, setResaltarDesde] = useState<string | null>(null);

  const { conectado } = useNotificacionesSocket({
    getToken,
    renovarToken,
    enabled: true,
  });
  const { data, isPending, isError, error, refetch } = useNotificaciones();
  const { vistoHasta, marcarVistas } = useNotificacionesVistas(userId);

  const notificaciones = data ?? [];
  const noLeidas = contarNoLeidas(notificaciones, vistoHasta);
  const contador = noLeidas > 9 ? "9+" : String(noLeidas);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) return;

    setResaltarDesde(vistoHasta);
    marcarVistas();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={
              noLeidas === 0
                ? "Notificaciones, sin novedades"
                : `Notificaciones, ${noLeidas} sin leer`
            }
          />
        }
      >
        <BellIcon />
        {noLeidas > 0 && (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold leading-none text-primary-foreground"
          >
            {contador}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <PopoverTitle className="text-sm font-semibold">
            Notificaciones
          </PopoverTitle>
          {!conectado && (
            <span
              className="text-xs text-muted-foreground"
              title="Las alertas nuevas aparecerán cuando vuelva la conexión en tiempo real"
            >
              Sin tiempo real
            </span>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto p-1.5">
          {isPending ? (
            <div className="space-y-2 p-1.5">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : isError ? (
            <div className="p-1.5">
              <ErrorAlert
                error={error}
                title="No se pudieron cargar las notificaciones"
                onRetry={() => void refetch()}
              />
            </div>
          ) : notificaciones.length === 0 ? (
            <EmptyState title="No tienes notificaciones" />
          ) : (
            <ul className="space-y-0.5">
              {notificaciones.map((notificacion) => (
                <NotificacionItem
                  key={notificacion.id}
                  notificacion={notificacion}
                  noLeida={esNoLeida(notificacion, resaltarDesde)}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
